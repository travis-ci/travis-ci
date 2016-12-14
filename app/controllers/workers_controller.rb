class WorkersController < ApplicationController
  responders :rabl
  respond_to :json

  def index
    respond_with workers
  end

  protected

    def workers
      @workers ||= Worker.order(:host, :name)
    end
end
