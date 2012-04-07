TravisCi::Application.routes.draw do

  constraints :host => Travis.config.shorten_host do
    get '/',    :to => 'shortener#index'
    get '/:id', :to => 'shortener#show'
  end

  root :to => 'home#index'

  resources :repositories, :only => [:index, :show] do
    resources :builds, :only => [:index, :show]
    resources :branches, :only => :index
  end

  resources :organizations, :only => :index

  resources :branches, :only => :index
  resources :builds,   :only => :show
  resources :requests, :only => :create
  resources :jobs,     :only => [:index, :show]

  get 'workers',     :to => 'workers#index'

  resource :profile, :only => [:show, :update] do
    get 'service_hooks',     :to => 'service_hooks#index'
    put 'service_hooks/:id', :to => 'service_hooks#update'
  end

  constraints :owner_name => /[^\/]+/, :name => /[^\/]+/ do
    get ":owner_name/:name.png", :to => 'repositories#show', :format => 'png'
    get ":owner_name/:name.json", :to => 'repositories#show', :format => 'json'
    get ":owner_name/:name.xml", :to => 'repositories#show', :format => 'xml'
    get ":owner_name/:name/cc.xml", :to => 'repositories#show', :format => 'xml', :schema => 'cctray'

    get ":owner_name/:name/builds.xml", :to => 'builds#index', :format => 'xml'
    get ":owner_name/:name/builds.json", :to => 'builds#index', :format => 'json'

    get ":owner_name/:name/builds/:id.xml", :to => 'builds#show', :format => 'xml'
    get ":owner_name/:name/builds/:id.json", :to => 'builds#show', :format => 'json'
  end

  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }

  as :user do
    get 'users/sign_out', :to => 'devise/sessions#destroy', :as => :destroy_session
  end

  get "/stats" => "statistics#index"

  # legacy routes used by github service hooks and workers
  post 'builds', :to => 'requests#create'
end

# we want these after everything else is loaded
TravisCi::Application.routes.append do
  constraints :user => /[^\/]+/, :repository => /[^\/]+/ do
    get ":user",                        :to => redirect("/#!/%{user}"),                            :as => :user_redirect
    get ":user/:repository",            :to => redirect("/#!/%{user}/%{repository}"),              :as => :user_repo_redirect
    get ":user/:repository/builds",     :to => redirect("/#!/%{user}/%{repository}/builds"),       :as => :user_repo_builds_redirect
    get ":user/:repository/builds/:id", :to => redirect("/#!/%{user}/%{repository}/builds/%{id}"), :as => :user_repo_build_redirect
  end

  get "/*path" => "home#not_found"
end
