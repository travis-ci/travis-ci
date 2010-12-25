TravisRails::Application.routes.draw do
  resources :repositories
  resources :builds do
    put 'log', :on => :member
  end

  root :to => 'application#index'
end
