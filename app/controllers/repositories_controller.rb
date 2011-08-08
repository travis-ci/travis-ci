class RepositoriesController < ApplicationController
  responders :rabl, :status_image

  prepend_view_path 'app/views/v1/default'

  respond_to :json, :xml
  respond_to :png, :only => :show

  def index
    respond_with(repositories)
  end

  def show
    respond_with(repository)
  end

  protected

    def repository
      @repository ||= Repository.find_by_params(params)
    end

    def repositories
      @repositories ||= begin
        scope = Repository.timeline.recent
        scope = scope.by_owner_name(params[:owner_name]) if params[:owner_name]
        scope = scope.search(params[:search])            if params[:search].present?
        scope
      end
    end
end
