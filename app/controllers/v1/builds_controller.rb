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
        service(:builds, :find_all, params).run
      end

      def build
        service(:builds, :find_one, params).run || raise(ActiveRecord::RecordNotFound)
      end
  end
end
