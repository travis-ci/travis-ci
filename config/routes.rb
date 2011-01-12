TravisRails::Application.routes.draw do
  devise_for :users
  as :user do
    get 'users/sign_out', :to => 'devise/sessions#destroy', :as => :destroy_session
  end

  resources :repositories do
    resources :builds
  end

  resources :builds do
    put 'log', :on => :member
  end

  resources :jobs

  root :to => 'application#index'
end
