TravisRails::Application.routes.draw do
  resources :repositories
  resources :builds

  # resource :socky do
  #   member do
  #     post :subscribe
  #     post :unsubscribe
  #   end
  # end

  root :to => 'application#index'
end
