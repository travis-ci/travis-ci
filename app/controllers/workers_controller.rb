class WorkersController < ApplicationController
  respond_to :json

  def index
    render :json => workers
  end
end
