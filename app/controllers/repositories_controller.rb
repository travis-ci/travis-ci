class RepositoriesController < ApplicationController
  respond_to :json, :xml

  def index
    @repositories = repositories

    respond_with(@repositories)
  end

  def show
    @repository = repository

    respond_with(@repository) do |format|
      format.png { send_status_image_file }
    end
  end

  protected

    def repository
      Repository.where(:name => params[:name], :owner_name => params[:owner_name]).first
    end

    def repositories
      repos = if params[:owner_name]
          Repository.where(:owner_name => params[:owner_name]).timeline
        else
          Repository.timeline.recent
        end

      params[:search].present? ? repos.search(params[:search]) : repos
    end

    def send_status_image_file
      status = Repository.human_status_by(params.slice(:owner_name, :name))
      path   = "#{Rails.public_path}/images/status/#{status}.png"

      response.headers["Expires"] = CGI.rfc1123_date(Time.now)

      send_file(path, :type => 'image/png', :disposition => 'inline')
    end

end
