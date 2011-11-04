class WorkersController < ApplicationController
  def index
    respond_to do |format|
      format.json { render :json => workers }
    end
  end

  protected

    def workers
      Worker.all(:order => [:host, :name]).map do |worker|
        { :id => worker.full_name } # TODO legacy, change this in the sproutcore client
      end
    end
end
