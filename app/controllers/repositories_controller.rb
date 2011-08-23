class RepositoriesController < ApplicationController
  respond_to :json, :xml

  def index
    @repositories = repositories

    respond_with(@repositories)
  end

  def show
    @repository = repository

    @repository.try(:override_last_finished_build_status!, params)

    respond_with(@repository) do |format|
      format.png { send_status_image_file }
      format.xml { send_repository_in_xml_format }
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
      status = if @repository.blank?
        Repository::STATUSES[nil]
      else
        @repository.last_finished_build_status_name
      end
      path = "#{Rails.public_path}/images/status/#{status}.png"
      response.headers["Expires"] = CGI.rfc1123_date(Time.now)
      send_file(path, :type => 'image/png', :disposition => 'inline')
    end
    
    VALID_XML_SCHEMAS = ["cctray"]
    
    def send_repository_in_xml_format
      schema_key = params[:schema].try(:downcase)
      
      if (schema_key && VALID_XML_SCHEMAS.include?(schema_key))
        render "repositories/show.#{schema_key}.xml.builder"
      else
        @repository
      end
    end
end
