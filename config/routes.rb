require 'shortener'

TravisCi::Application.routes.draw do

  constraints :domain => 'trvs.io' do
    mount Travis::Shortener => '/'
  end

  root :to => 'home#index'

  resources :repositories, :only => [:index, :show] do
    resources :builds, :only => [:index, :show]
    resources :branches, :only => :index
  end

  resources :builds,   :only => :show
  resources :requests, :only => :create
  resources :jobs,     :only => [:index, :show]


  # match 'queues',      :to => 'queues#index'
  match 'workers',     :to => 'workers#index'

  resource :profile, :only => [:show, :update] do
    get 'service_hooks',     :to => 'service_hooks#index'
    put 'service_hooks/:id', :to => 'service_hooks#update'
  end

  constraints :owner_name => /[^\/]+/, :name => /[^\/]+/ do
    match ":owner_name/:name.png", :to => 'repositories#show', :format => 'png'
    match ":owner_name/:name.json", :to => 'repositories#show', :format => 'json'
    match ":owner_name/:name.xml", :to => 'repositories#show', :format => 'xml'
    match ":owner_name/:name/cc.xml", :to => 'repositories#show', :format => 'xml', :schema => 'cctray'

    match ":owner_name/:name/builds.xml", :to => 'builds#index', :format => 'xml'
    match ":owner_name/:name/builds.json", :to => 'builds#index', :format => 'json'

    match ":owner_name/:name/builds/:id.xml", :to => 'builds#show', :format => 'xml'
    match ":owner_name/:name/builds/:id.json", :to => 'builds#show', :format => 'json'
  end

  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }

  as :user do
    get 'users/sign_out', :to => 'devise/sessions#destroy', :as => :destroy_session
  end

  match "/stats" => "statistics#index"

  # legacy routes used by github service hooks and workers
  post 'builds',         :to => 'requests#create'
  put  'builds/:id',     :to => 'jobs#update'
  put  'builds/:id/log', :to => 'jobs#log'

end

# we want these after everything else is loaded
TravisCi::Application.routes.append do
  constraints :user => /[^\/]+/, :repository => /[^\/]+/ do
    match ":user",                        :to => redirect("/#!/%{user}"),                            :as => :user_redirect
    match ":user/:repository",            :to => redirect("/#!/%{user}/%{repository}"),              :as => :user_repo_redirect
    match ":user/:repository/builds",     :to => redirect("/#!/%{user}/%{repository}/builds"),       :as => :user_repo_builds_redirect
    match ":user/:repository/builds/:id", :to => redirect("/#!/%{user}/%{repository}/builds/%{id}"), :as => :user_repo_build_redirect
  end

  match "/*path" => "home#not_found"
end
