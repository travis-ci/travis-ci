require 'responders'

class RepositoriesController < ApplicationController
  responders :json, :xml, :result_image

  respond_to :json, :xml
  respond_to :png, :only => :show

  def index
    respond_with(repositories)
  end

  def show
    respond_with(repository)
  end

  protected

    def repositories
      @repositories ||= begin
        scope = params[:login] ? organization.repositories : Repository.timeline.recent
        scope = scope.by_owner_name(params[:owner_name]) if params[:owner_name]
        scope = scope.by_slug(params[:slug])             if params[:slug]
        scope = scope.search(params[:search])            if params[:search].present?
        scope
      end
    end

    def organization
      @organization ||= Organization.find_by_login!(params[:login])
    end

    def repository
      begin
        @repository ||= Repository.find_by(params)
      rescue ActiveRecord::RecordNotFound
        raise if not params[:format] == 'png'
      end
    end
end
