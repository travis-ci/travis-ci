class QueuesController < ApplicationController
  respond_to :json

  def index
    respond_with jobs(params[:queue])
  end
end
