class RepositoriesController < ApplicationController
  respond_to :json

  def index
    respond_with(repositories)
  end

  def show
    respond_to do |format|
      format.json do
        render :json => repository
      end
      format.png do
        response.headers["Expires"] = CGI.rfc1123_date(Time.now)
        send_file(status_image_path, :type => 'image/png', :disposition => 'inline')
      end
      format.xml do
        response.headers["Expires"] = CGI.rfc1123_date(Time.now)
        render :xml => Repository.xml_status_by(params.slice(:owner_name, :name))
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

    def status_image_path
      status = Repository.human_status_by(params.slice(:owner_name, :name))
      "#{Rails.public_path}/images/status/#{status}.png"
    end

end
