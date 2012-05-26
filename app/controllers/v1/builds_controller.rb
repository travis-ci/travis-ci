require 'responders'

module V1
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

      def builds_type
        repository.builds.by_event_type(params['event_type'])
      end

      def builds
        @builds ||= begin
          if build_number = params['after_number']
            builds_type.older_than(build_number)
          else
            builds_type.recent
          end
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
