Rails.application.routes.draw do
  get :health, to: 'health#index'

  # 认证路由
  post '/register', to: 'registrations#create'
  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'
  get '/me', to: 'sessions#show'

  # 用户资源路由
  resources :users do
    collection do
      get :authors, to: 'users#authors'
      get :clients, to: 'users#clients'
    end
  end

  # 文章资源路由
  resources :articles do
    collection do
      get :public, to: 'articles#public'
    end
    member do
      post :publish, to: 'articles#publish'
      post :unpublish, to: 'articles#unpublish'
      get :challenge, to: 'articles#challenge'
      post :verify_access, to: 'articles#verify_access'
    end
  end

  # 委托资源路由
  resources :commissions do
    collection do
      get :available, to: 'commissions#available'
    end
    member do
      put :assign, to: 'commissions#assign'
      put :status, to: 'commissions#update_status'
      post :verify_email, to: 'commissions#verify_email'
      post :send_success_email, to: 'commissions#send_success_email'
    end
  end
end

