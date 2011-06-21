class JobsController < ApplicationController

  def index
    respond_to do |format|
      format.json { render :json => jobs }
    end
  end

end
