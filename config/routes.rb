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

  match ":user/:name.png", :to => 'repositories#show', :format => 'png'
  #redirect { |params|
    #"/images/status/#{Repository.human_status_by_name("#{params[:user]}/#{params[:name]}")}.png"
  #}

  match ":user/:repository", :to => redirect("#!/%{user}/%{repository}")

  root :to => 'application#index'
end
