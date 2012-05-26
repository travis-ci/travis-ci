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
        @jobs ||= Job.queued.where(:queue => params[:queue])
      end

      def job
        @job ||= Job.find(params[:id])
      end
  end
end
