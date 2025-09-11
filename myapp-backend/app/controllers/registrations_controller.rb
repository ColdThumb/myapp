class RegistrationsController < ApplicationController
  # POST /register - 用户注册
  def create
    user = User.new(user_params)
    # 默认所有新用户都是客户
    user.is_client = true
    user.is_author = false
    
    if user.save
      session[:user_id] = user.id
      render json: {
        message: '注册成功',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          is_author: user.is_author,
          is_client: user.is_client,
          bio: user.bio
        }
      }, status: :created
    else
      Rails.logger.error "用户注册失败: #{user.errors.full_messages.join(', ')}"
      render json: {
        error: '注册失败',
        errors: user.errors.full_messages
      }, status: :unprocessable_entity
    end
  rescue => e
    Rails.logger.error "注册过程中发生异常: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    render json: {
      error: '服务器内部错误，请稍后重试',
      message: e.message
    }, status: :internal_server_error
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :bio)
  end
end