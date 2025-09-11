class SessionsController < ApplicationController
  before_action :require_login, only: [:show, :destroy]

  # GET /me - 获取当前用户信息
  def show
    render json: {
      user: {
        id: current_user.id,
        name: current_user.name,
        email: current_user.email,
        is_author: current_user.is_author,
        is_client: current_user.is_client,
        bio: current_user.bio
      }
    }
  end

  # POST /login - 用户登录
  def create
    user = User.find_by(email: params[:email]&.downcase)
    
    if user&.authenticate(params[:password])
      session[:user_id] = user.id
      render json: {
        message: '登录成功',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          is_author: user.is_author,
          is_client: user.is_client,
          bio: user.bio
        }
      }, status: :ok
    else
      render json: {
        error: '邮箱或密码错误'
      }, status: :unauthorized
    end
  end

  # DELETE /logout - 用户登出
  def destroy
    session[:user_id] = nil
    render json: {
      message: '登出成功'
    }, status: :ok
  end

  private

  def session_params
    params.permit(:email, :password)
  end
end