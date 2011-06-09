class RepositoriesController < ApplicationController
  before_filter :authenticate_user!, :only => [ :my ]

  respond_to :json

  def index
    render :json => repositories.as_json
  end

  def show
    respond_to do |format|
      format.json do
        render :json => repository.as_json
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
    respond_to do |format|
      format.html do
        render "my"
      end
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
