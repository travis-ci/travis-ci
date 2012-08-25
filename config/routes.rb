require 'api_constraints'

TravisCi::Application.routes.draw do
  constraints :host => Travis.config.shorten_host do
    get '/',    :to => 'shortener#index'
    get '/:id', :to => 'shortener#show'
  end

  root :to => 'home#index'

  resource :profile, :only => [:show, :update] do
    get  'syncing', :to => 'profiles#syncing', :as => 'syncing'
    post 'sync', :to => 'profiles#sync'
  end
  get 'profile/:owner_name(/:tab)', :to => 'profiles#show', :as => 'profile_tab'

  devise_for :users, :controllers => { :omniauth_callbacks => 'users/omniauth_callbacks' }
  as :user do
    get 'sessions/new',      :to => 'sessions#new',     :as => :sign_in
    get 'sessions/sign_out', :to => 'sessions#destroy', :as => :sign_out
  end

  get '/stats' => 'statistics#index'

  api = lambda do
    constraints :format => 'json' do
      resources :repositories, :only => [:index, :show]
      resources :builds,       :only => [:index, :show]
      resources :branches,     :only => :index
      resources :jobs,         :only => [:index, :show]
      resources :workers,      :only => :index

      get 'service_hooks',     :to => 'service_hooks#index'
      put 'service_hooks/:id', :to => 'service_hooks#update', :id => /[\w-]*:[\w.-]*/
    end

    constraints :owner_name => /[^\/]+/, :name => /[^\/]+/ do
      get ':owner_name/:name.json',            :to => 'repositories#show', :format => :json
      get ':owner_name/:name/builds.json',     :to => 'builds#index',      :format => :json
      get ':owner_name/:name/builds/:id.json', :to => 'builds#show',       :format => :json
      get ':owner_name/:name.png',             :to => 'repositories#show', :format => :png
      get ':owner_name/:name/cc.xml',          :to => 'repositories#show', :format => :xml, :schema => 'cctray'
    end
  end

  scope :module => 'v2', constraints: ApiConstraints.new(version: 2) do
    resources :artifacts, :only => :show
  end

  scope :module => 'v2', constraints: ApiConstraints.new(version: 2), &api
  scope :module => 'v1', constraints: ApiConstraints.new(version: 1, default: true), &api
end

# we want these after everything else is loaded
TravisCi::Application.routes.append do
  constraints :owner => /[^\/]+/, :name => /[^\/]+/ do
    get ':owner',                  :to => 'redirect#owner'
    get ':owner/:name',            :to => 'redirect#repository'
    get ':owner/:name/builds',     :to => 'redirect#builds'
    get ':owner/:name/builds/:id', :to => 'redirect#build'
    get ':owner/:name/jobs/:id',   :to => 'redirect#job'
  end

  get '/*path' => 'home#not_found'
end
