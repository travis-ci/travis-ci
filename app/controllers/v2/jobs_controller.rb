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
        @jobs ||= if params[:ids]
          Job.where(:id => params[:ids]).includes(:commit, :log)
        else
          jobs = Job.queued.includes(:commit, :log)
          jobs = jobs.where(:queue => params[:queue]) if params[:queue]
          jobs
        end
      end

      def job
        @job ||= Job.find(params[:id])
      end
  end
end
