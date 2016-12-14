require 'responders'

module V2
  class WorkersController < ApiController
    responders :json
    respond_to :json

    def index
      respond_with workers
    end

    protected

      def workers
        @workers ||= Worker.order(:host, :name)
      end
  end
end
