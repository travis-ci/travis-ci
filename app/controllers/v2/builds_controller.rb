require 'responders'

module V2
  class BuildsController < ApiController
    responders :json
    respond_to :json

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
          scope.includes(:commit, matrix: [:commit, :log]).find(params[:id])
        end
      end
  end
end
