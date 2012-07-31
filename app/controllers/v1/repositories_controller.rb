require 'responders'

module V1
  class RepositoriesController < ApplicationController
    # TODO for some reason this doesn't work with an ApiController
    # sending_file= seems to be called on an nil response
    # include ActionController::DataStreaming

    helper :repositories

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
          scope = Repository.timeline.recent
          scope = scope.by_member(params[:owner_name]) if params[:owner_name]
          scope = scope.by_slug(params[:slug])         if params[:slug]
          scope = scope.search(params[:search])        if params[:search].present?
          scope
        end
      end

      def repository
        begin
          @repository ||= Repository.find_by(params)
        rescue ActiveRecord::RecordNotFound
          raise if not params[:format] == 'png'
        end
      end
  end
end
