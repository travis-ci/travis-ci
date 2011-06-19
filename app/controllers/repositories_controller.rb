class RepositoriesController < ApplicationController
  before_filter :authenticate_user!, :only => [ :my, :create ]
  # protect_from_forgery :except => :create
  respond_to :json

  def index
    render :json => repositories
  end

  def show
    respond_to do |format|
      format.json do
        render :json => repository
      end
      format.png do
        status = Repository.human_status_by(params.slice(:owner_name, :name))

        response.headers["Expires"] = CGI.rfc1123_date(Time.now)
        send_file("#{Rails.public_path}/images/status/#{status}.png", :type => 'image/png', :disposition => 'inline')
      end
    end
  end

  def my
    @repositories = Octokit.repositories(current_user.login)
    @repositories.each do |repository|
      # Please refer to https://github.com/intridea/omniauth/issues/203 for details.
      # Without authenticity token our POST request will cause session unset.
      repository.authenticity_token = form_authenticity_token
      existing_repository = Repository.find_by_name_and_owner_name(repository.name, repository.owner)
      repository.is_active = existing_repository.nil? || existing_repository.is_active
    end

    respond_to do |format|
      format.json do
        render :json => @repositories.as_json
      end

      format.html do
        render "my"
      end
    end
  end


  def update
    @repository = Repository.find(params[:id])
    begin
      if params[:is_active]
        subscribe_service_hook
      else
        unsubscribe_service_hook
      end
      @repository.save
      render :json => @repository
    rescue Exception => e
      puts e.message
      render :json => @repository, :status => :not_acceptable
    end
  end

  def create
    @repository = Repository.find_or_create_by_name_and_owner_name(params[:name], params[:owner])

    # Octokit doesn't have internal error processing. Subscribe will throw an exception when fails. Further investigation + some use-cases will give a hint about what kind
    # of error handling might be useful here.
    begin
      subscribe_service_hook
      @repository.save
      render :json => @repository
    rescue
      render :json => @repository, :status => :not_acceptable
    end
  end

  protected
    def repositories
      repos = if params[:owner_name]
          Repository.where(:owner_name => params[:owner_name]).timeline
        else
          Repository.timeline.recent
        end

      params[:search].present? ? repos.search(params[:search]) : repos
    end

    def repository
      @repository ||= params[:id] ? Repository.find(params[:id]) : nil
    end
    helper_method :repository

    def octokit_client
      Octokit::Client.new(:oauth_token => current_user.github_oauth_token)
    end

    def unsubscribe_service_hook
      octokit_client.unsubscribe_service_hook(@repository.owner_name, @repository.name, "Travis")
      @repository.is_active = false
    end

    def subscribe_service_hook
      octokit_client.subscribe_service_hook(@repository.owner_name, @repository.name, "Travis", {
        :token => current_user.tokens.first.token,
        :user => current_user.login,
        :domain => Travis.config['rails']['host']
      })
      @repository.is_active = true
    end
end
