class JobsController < ApplicationController
  respond_to :json

  def index
    render :json => jobs
  end
end
