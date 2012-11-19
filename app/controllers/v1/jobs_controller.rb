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
        service(:find_jobs, params).run
      end

      def job
        service(:find_job, params).run || raise(ActiveRecord::RecordNotFound)
      end
  end
end
