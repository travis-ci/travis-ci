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

      def builds
        service(:find_builds, params).run
      end

      def build
        service(:find_build, params).run || raise(ActiveRecord::RecordNotFound)
      end
  end
end
