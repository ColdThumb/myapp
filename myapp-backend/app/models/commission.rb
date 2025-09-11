class Commission < ApplicationRecord
  # Associations
  belongs_to :customer, class_name: "User"
  belongs_to :assigned_author, class_name: "User", optional: true

  # Enums（保持你原来的定义）
  enum :status, {
    open: 0,
    assigned: 1,
    in_progress: 2,
    completed: 3,
    cancelled: 4
  }, validate: true

  # -------------------------
  # 回调：自动设置默认交付日（创建时无值 → +30天）
  # -------------------------
  before_validation :set_default_estimated_delivery_date, on: :create

  # -------------------------
  # Validations
  # -------------------------
  validates :title, presence: true
  validates :budget, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :status, presence: true

  # 交付日：允许为空；有值时必须大于“今天”
  validates :estimated_delivery_date,
           comparison: { greater_than: -> { Date.current } },
           allow_nil: true

  # 进度（你新增的列）：0..100 的整数
  validates :progress_pct,
           numericality: {
             only_integer: true,
             greater_than_or_equal_to: 0,
             less_than_or_equal_to: 100
           },
           allow_nil: true
           
  # 设置默认进度
  before_validation :set_default_progress, on: :create

  # 业务规则
  validate :customer_must_be_client
  validate :assigned_author_must_be_author, if: -> { assigned_author.present? }
  validate :assigned_author_presence_matches_status
  validate :status_transition_is_valid, on: :update

  # Scopes（保留你的）
  scope :active,    -> { where.not(status: statuses[:cancelled]) }
  scope :available, -> { where(status: statuses[:open]) }
  
  # 虚拟属性，用于邮件模板
  def customer_name
    customer&.name
  end
  
  def customer_email
    customer&.email
  end

  private

  # 创建时自动计算预计交付日期：
  # 如果是第一个委托，则为提交时间+15天
  # 否则为上一个委托的预计交付时间+15天
  def set_default_estimated_delivery_date
    # 只有当预计交付日期为空时才自动计算
    return if self.estimated_delivery_date.present?
    
    begin
      # 默认值：提交时间+15天
      self.estimated_delivery_date = 15.days.from_now.to_date
      
      # 尝试查找最后一个有效委托
      if Commission.count > 0
        # 查找最后一个有效委托（按创建时间排序，排除已取消的委托和当前委托）
        query = Commission.where.not(status: :cancelled)
        query = query.where.not(id: self.id) if self.persisted? # 排除当前委托（如果已保存）
        last_commission = query.order(created_at: :desc).first
        
        # 如果找到了上一个委托，则使用其预计交付时间+15天
        if last_commission.present? && last_commission.estimated_delivery_date.present?
          self.estimated_delivery_date = (last_commission.estimated_delivery_date + 15.days).to_date
        end
      end
    rescue => e
      # 出错时记录日志并使用默认值
      Rails.logger.error("Error calculating estimated_delivery_date: #{e.message}")
      self.estimated_delivery_date = 15.days.from_now.to_date
    end
  end
  
  # 创建时默认进度：0%
  def set_default_progress
    self.progress_pct ||= 0
  end

  # 客户必须是 client
  def customer_must_be_client
    errors.add(:customer, "must be a client") unless customer&.is_client?
  end

  # 被指派者必须是 author
  def assigned_author_must_be_author
    errors.add(:assigned_author, "must be an author") unless assigned_author&.is_author?
  end

  # 状态与负责人一致性：
  # - open：不应有 assigned_author
  # - assigned / in_progress / completed：必须有 assigned_author
  # - cancelled：可有可无（看你需求；这里允许为空或保留原负责人）
  def assigned_author_presence_matches_status
    case status&.to_sym
    when :open
      if assigned_author_id.present?
        errors.add(:assigned_author, "must be blank when status is open")
      end
    when :assigned, :in_progress, :completed
      if assigned_author_id.blank?
        errors.add(:assigned_author, "must be present when status is #{status}")
      end
    when :cancelled
      # 不强制
    end
  end

  # 状态流转约束（可按需放宽）：
  # open → assigned/cancelled
  # assigned → in_progress/cancelled
  # in_progress → completed/cancelled
  # completed/cancelled → 不能再改（除非你允许回退）
  def status_transition_is_valid
    return unless will_save_change_to_status? && status_previously_was.present?

    from = status_previously_was.to_sym
    to   = status.to_sym

    allowed = {
      open:        %i[assigned cancelled],
      assigned:    %i[in_progress cancelled],
      in_progress: %i[completed cancelled],
      completed:   [],   # 锁死，完成后不可改
      cancelled:   []    # 锁死，取消后不可改
    }

    unless allowed.fetch(from, []).include?(to)
      errors.add(:status, "transition from #{from} to #{to} is not allowed")
    end
  end
end
