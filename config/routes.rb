TravisRails::Application.routes.draw do
  resources :repositories do
    resources :builds
  end

  resources :builds do
    put 'log', :on => :member
  end

  root :to => 'application#index'
end
