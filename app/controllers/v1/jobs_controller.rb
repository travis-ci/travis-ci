require 'responders'

module V1
  class JobsController < ApiController
    responders :json
    respond_to :json

    def index
      respond_with jobs
    end

    def show
      respond_with job
    end

    protected

      def jobs
        service(:jobs, :all, params).run
      end

      def job
        service(:jobs, :one, params).run
      end
  end
end
