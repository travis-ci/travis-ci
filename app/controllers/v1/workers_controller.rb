require 'responders'

module V1
  class WorkersController < ApplicationController
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
