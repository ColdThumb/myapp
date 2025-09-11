class ApplicationController < ActionController::API
  # 启用会话支持
  include ActionController::Cookies
  
  protected
  
  # 获取当前登录用户
  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end
  
  # 检查用户是否已登录
  def logged_in?
    !!current_user
  end
  
  # 要求用户登录
  def require_login
    unless logged_in?
      render json: { error: '请先登录' }, status: :unauthorized
    end
  end
  
  # 要求用户是作者
  def require_author
    require_login
    unless current_user&.author?
      render json: { error: '需要作者权限' }, status: :forbidden
    end
  end
  
  # 要求用户是管理员或作者
  def require_admin_or_author
    require_login
    unless current_user&.author?
      render json: { error: '需要管理员或作者权限' }, status: :forbidden
    end
  end
end
