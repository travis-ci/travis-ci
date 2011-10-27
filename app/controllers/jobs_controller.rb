require 'responders'

class JobsController < ApplicationController
  responders :rabl
  respond_to :json

  def show
    respond_with job
  end

  protected

    def job
      @job ||= Job.find(params[:id])
    end
end

