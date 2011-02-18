TravisRails::Application.routes.draw do
  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }

  as :user do
    get 'users/sign_out', :to => 'devise/sessions#destroy', :as => :destroy_session
  end
  resource :profile

  resources :repositories do
    resources :builds
  end

  resources :builds do
    put 'log', :on => :member
  end

  resources :jobs
  resources :workers

  root :to => 'application#index'
end
