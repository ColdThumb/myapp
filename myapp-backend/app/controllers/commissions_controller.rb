class CommissionsController < ApplicationController
  # GET /commissions
  def index
    @commissions = Commission.all
    render json: @commissions
  end

  # GET /commissions/1
  def show
    @commission = Commission.find(params[:id])

    # 如果用户已登录且是作者，直接返回完整的委托详情
    if logged_in? && current_user.author?
      commission_detail = @commission.as_json(include: {
        customer: { only: [ :name, :email, :bio ] },
        assigned_author: { only: [ :name, :email, :bio ] }
      })
      render json: commission_detail
    else
      # 未登录用户或非作者只能看到基本信息
      render json: @commission.as_json(except: [ :customer_id, :assigned_author_id ])
    end
  end

  # GET /commissions/available
  def available
    @commissions = Commission.available
    render json: @commissions
  end

  # POST /commissions
  def create
    # 处理客户信息：根据邮箱查找或创建用户
    customer = nil
    if params[:customer_email].present?
      customer = User.find_by(email: params[:customer_email])

      # 如果用户不存在，创建新用户
      unless customer
        # 为匿名用户生成临时密码
        temp_password = SecureRandom.hex(8)
        customer = User.new(
          email: params[:customer_email],
          name: params[:customer_name] || "Anonymous",
          password: temp_password,
          password_confirmation: temp_password,
          is_client: true,
          is_author: false
        )

        unless customer.save
          Rails.logger.error "创建客户用户失败: #{customer.errors.full_messages.join(', ')}"
          render json: {
            error: "创建用户失败",
            errors: customer.errors.full_messages
          }, status: :unprocessable_entity
          return
        end
      end
    end

    # 创建委托，只包含Commission模型的有效字段
    commission_data = {
      title: params[:title],
      description: params[:description],
      budget: params[:budget],
      status: params[:status] || "open",
      estimated_delivery_date: params[:estimated_delivery_date],
      customer_id: customer&.id,
      progress_pct: 0  # 设置默认进度
    }

    @commission = Commission.new(commission_data)

    if @commission.save
      # 异步发送委托提交成功邮件
      begin
        CommissionMailer.commission_submitted(@commission).deliver_later
        Rails.logger.info "委托提交成功邮件已加入发送队列: #{customer.email}"
      rescue => e
        Rails.logger.error "邮件加入队列失败: #{e.message}"
        # 邮件发送失败不影响委托创建，只记录错误
      end

      render json: @commission, status: :created, location: @commission
    else
      Rails.logger.error "创建委托失败: #{@commission.errors.full_messages.join(', ')}"
      render json: {
        error: "创建委托失败",
        errors: @commission.errors.full_messages
      }, status: :unprocessable_entity
    end
  rescue => e
    Rails.logger.error "委托创建过程中发生异常: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    render json: {
      error: "服务器内部错误，请稍后再试",
      message: e.message
    }, status: :internal_server_error
  end

  # PATCH/PUT /commissions/1
  def update
    @commission = Commission.find(params[:id])
    
    # 检查委托状态是否为'open'
    unless @commission.status == 'open'
      render json: { error: "只有待接单状态的委托才能被编辑" }, status: :forbidden
      return
    end
    
    # 检查用户权限：已登录的作者可以编辑，或者通过邮箱验证的客户可以编辑
    unless (logged_in? && current_user.author?) || 
           (params[:customer_email].present? && @commission.customer&.email&.downcase == params[:customer_email]&.downcase)
      render json: { error: "需要作者权限或通过邮箱验证才能编辑委托" }, status: :forbidden
      return
    end

    # 处理客户信息更新
    if params[:customer_email].present? && params[:customer_name].present?
      customer = @commission.customer
      if customer
        customer.update(
          email: params[:customer_email],
          name: params[:customer_name]
        )
      end
    end

    # 更新委托信息（排除客户相关字段）
    commission_data = commission_params.except(:customer_name, :customer_email)

    if @commission.update(commission_data)
      # 返回包含更新后客户信息的委托数据
      commission_detail = @commission.as_json(include: {
        customer: { only: [ :name, :email, :bio ] },
        assigned_author: { only: [ :name, :email, :bio ] }
      })
      render json: commission_detail
    else
      render json: @commission.errors, status: :unprocessable_entity
    end
  end

  # PUT /commissions/1/assign
  def assign
    @commission = Commission.find(params[:id])
    if @commission.update(assigned_author_id: params[:assigned_author_id], status: "assigned")
      render json: @commission
    else
      render json: @commission.errors, status: :unprocessable_entity
    end
  end

  # PUT /commissions/1/status
  def update_status
    @commission = Commission.find(params[:id])

    # 检查用户权限：只有已登录的作者可以修改委托状态
    unless logged_in? && current_user.author?
      render json: { error: "需要作者权限才能修改委托状态" }, status: :forbidden
      return
    end

    # 如果状态需要分配作者，自动分配当前作者
    update_params = { status: params[:status] }
    if [ "assigned", "in_progress", "completed" ].include?(params[:status]) && @commission.assigned_author_id.blank?
      update_params[:assigned_author_id] = current_user.id
    end

    if @commission.update(update_params)
      # 异步发送状态更新邮件通知
      begin
        CommissionMailer.commission_status_updated(@commission).deliver_later
        Rails.logger.info "委托状态更新邮件已加入发送队列: #{@commission.customer.email}"
      rescue => e
        Rails.logger.error "邮件加入队列失败: #{e.message}"
        # 邮件发送失败不影响状态更新，只记录错误
      end

      # 返回包含关联数据的完整委托信息
      commission_detail = @commission.as_json(include: {
        customer: { only: [ :name, :email, :bio ] },
        assigned_author: { only: [ :name, :email, :bio ] }
      })
      render json: commission_detail
    else
      render json: {
        error: "状态更新失败",
        errors: @commission.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # DELETE /commissions/1
  def destroy
    @commission = Commission.find(params[:id])
    
    # 检查委托状态是否为'open'
    unless @commission.status == 'open'
      render json: { error: "只有待接单状态的委托才能被删除" }, status: :forbidden
      return
    end
    
    # 检查用户权限：已登录的作者可以删除，或者通过邮箱验证的客户可以删除
    unless (logged_in? && current_user.author?) || 
           (params[:email].present? && @commission.customer&.email&.downcase == params[:email]&.downcase)
      render json: { error: "需要作者权限或通过邮箱验证才能删除委托" }, status: :forbidden
      return
    end
    
    @commission.destroy
    render json: { success: true, message: "委托已成功删除" }
  end

  # POST /commissions/1/verify_email
  def verify_email
    @commission = Commission.find(params[:id])

    if params[:email].blank?
      render json: { error: "邮箱地址不能为空" }, status: :bad_request
      return
    end

    # 验证邮箱是否匹配委托的客户邮箱（不区分大小写）
    if @commission.customer&.email&.downcase == params[:email]&.downcase
      # 返回完整的委托详情，包含客户和作者信息
      commission_detail = @commission.as_json(include: {
        customer: { only: [ :id, :name, :email, :bio ] },
        assigned_author: { only: [ :id, :name, :email, :bio ] }
      })
      render json: { success: true, commission: commission_detail }
    else
      render json: { success: false, error: "邮箱地址不匹配" }, status: :unauthorized
    end
  end

  # POST /commissions/1/send_success_email
  def send_success_email
    @commission = Commission.find(params[:id])

    begin
      CommissionMailer.commission_submitted(@commission).deliver_later
      Rails.logger.info "委托提交成功邮件已加入发送队列: #{@commission.customer.email}"
      render json: { success: true, message: "邮件已加入发送队列" }
    rescue => e
      Rails.logger.error "邮件加入队列失败: #{e.message}"
      render json: {
        success: false,
        error: "邮件加入队列失败",
        message: e.message
      }, status: :internal_server_error
    end
  end

  private
    # Only allow a list of trusted parameters through.
    def commission_params
      params.permit(:title, :description, :budget, :status, :customer_id, :assigned_author_id, :estimated_delivery_date, :customer_name, :customer_email)
    end
end
