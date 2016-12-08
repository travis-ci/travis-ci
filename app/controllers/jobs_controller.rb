require 'responders'

class JobsController < ApplicationController
  responders :rabl
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

