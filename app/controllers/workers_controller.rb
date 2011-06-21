class WorkersController < ApplicationController

  def index
    respond_to do |format|
      format.json { render :json => workers }
    end
  end

end
