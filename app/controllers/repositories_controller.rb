class RepositoriesController < ApplicationController
  respond_to :json, :xml

  def index
    @repositories = repositories
    respond_to do |format|
      format.xml { render :index }
      format.json { render :index }
    end
  end

  def show
    @repository = Repository.where(params.slice(:owner_name, :name)).first

    respond_to do |format|
      format.xml { render :show }
      format.json { render :show }
      format.png do
        response.headers["Expires"] = CGI.rfc1123_date(Time.now)
        send_file("#{Rails.public_path}/images/status/#{@repository.human_status}.png", :type => 'image/png', :disposition => 'inline')
      end
    end
  end

  protected

    def repository
      Repository.find(params[:id])
    end

    def repositories
      repos = if params[:owner_name]
          Repository.where(:owner_name => params[:owner_name]).timeline
        else
          Repository.timeline.recent
        end

      params[:search].present? ? repos.search(params[:search]) : repos
    end
end
