require 'responders'

module V2
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
        @jobs ||= begin
          jobs = Job.queued
          jobs = jobs.where(:queue => params[:queue]) if params[:queue]
          jobs
        end
      end

      def job
        @job ||= Job.find(params[:id])
      end
  end
end
