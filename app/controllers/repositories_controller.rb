class RepositoriesController < ApplicationController
  respond_to :json, :xml

  def index
    @repositories = repositories

    respond_with(@repositories)
  end

  def show
    @repository = repository

    @repository.override_last_build_status!(params) if @repository.try(:override_last_build_status?, params)

    respond_with(@repository) do |format|
      format.png { send_status_image_file }
      format.any { @repository || not_found }
    end
  end

  protected

    def repositories
      @repositories ||= if params[:owner_name]
        Repository.where(:owner_name => params[:owner_name]).timeline
      else
        Repository.timeline.recent
      end

      params[:search].present? ? @repositories.search(params[:search]) : @repositories
    end

    def repository
      @repository ||= Repository.find_by_params(params)
    end

    def send_status_image_file
      status = Repository.human_status_by(params.slice(:owner_name, :name, :branch))
      path   = "#{Rails.public_path}/images/status/#{status}.png"

      response.headers["Expires"] = CGI.rfc1123_date(Time.now)

      send_file(path, :type => 'image/png', :disposition => 'inline')
    end
end
