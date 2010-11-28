TravisRails::Application.routes.draw do
  resources :builds

  resource :socky do
    member do
      post :subscribe
      post :unsubscribe
    end
  end

  root :to => 'builds#index'
end
