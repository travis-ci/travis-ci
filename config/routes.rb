require 'patches/rails_route_set'

TravisCi::Application.routes.draw do
  root :to => 'home#index'

  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }

  as :user do
    get 'users/sign_out', :to => 'devise/sessions#destroy', :as => :destroy_session
  end

  resource :profile, :only => :show do
    get    :repositories
    post   :repositories, :to => 'profiles#add_service_hook'
    delete :repositories, :to => 'profiles#remove_service_hook'
  end

  resources :repositories do
    resources :builds
  end

  resources :builds do
    put 'log', :on => :member, :as => :log
  end

  resources :jobs
  resources :workers

  match ":owner_name/:name.png", :to => 'repositories#show', :format => 'png'

  # need to include the jammit route here so it preceeds the user route below
  match "/#{Jammit.package_path}/:package.:extension", :to => 'jammit#package', :as => :jammit, :constraints => { :extension => /.+/ }
end

# we want these AFTER rails admin is loaded
TravisCi::Application.routes.append do
  match ":user", :to => redirect("/#!/%{user}"), :as => :user_redirect
  match ":user/:repository", :to => redirect("/#!/%{user}/%{repository}"), :as => :user_repo_redirect
  match ":user/:repository/builds", :to => redirect("/#!/%{user}/%{repository}/builds"), :as => :user_repo_builds_redirect
  match ":user/:repository/builds/:id", :to => redirect("/#!/%{user}/%{repository}/builds/%{id}"), :as => :user_repo_build_redirect
end
