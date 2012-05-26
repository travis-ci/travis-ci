require 'responders'

module V2
  class BuildsController < ApplicationController
    responders :json
    respond_to :json

    # Github does not currently post the payload with the correct accept or content-type headers.
    # We need to change Github's service-hook code for this to work correctly.
    skip_before_filter :verify_authenticity_token, :only => :create

    def index
      respond_with builds
    end

    def show
      respond_with build
    end

    protected

      def repository
        @repository ||= Repository.find_by(params) || not_found
      end

      def builds
        @builds ||= begin
          scope = repository.builds.by_event_type(params[:event_type] || 'push')
          scope = params[:after] ? scope.older_than(params[:after]) : scope.recent
          scope
        end
      end

      def build
        @build ||= begin
          scope = params['repository_id'] ? repository.builds : Build
          scope.includes(:commit, :matrix => [:commit, :log]).find(params[:id])
        end
      end
  end
end
