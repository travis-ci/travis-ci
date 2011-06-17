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
      repository.travis_enabled = Repository.exists?({ :name => repository.name, :owner_name => repository.owner })
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

  def create
    @repository = Repository.find_or_create_by_name_and_owner_name(params[:name], params[:owner])
    client = Octokit::Client.new(:oauth_token => current_user.github_oauth_token)

    # Octokit doesn't have internal error processing. Subscribe will throw an exception when fails. Further investigation + some use-cases will give a hint about what kind
    # of error handling might be useful here.
    begin
      client.subscribe_service_hook(@repository.owner_name, @repository.name, "Travis", {
        :token => current_user.tokens.first.token,
        :user => current_user.login,
        :domain => Travis.config['rails']['host']
      })
      render :json => @repository
    rescue
      render :json => @repository, :status => :not_acceptable
    end
  end

  protected
    def repositories
      repos = params[:owner_name] ? Repository.where(:owner_name => params[:owner_name]).timeline : Repository.timeline.recent
      params[:search].present? ? repos.search(params[:search]) : repos
    end

    def repository
      @repository ||= params[:id] ? Repository.find(params[:id]) : nil
    end
    helper_method :repository
end
