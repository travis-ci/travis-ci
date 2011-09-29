require 'responders'

class TasksController < ApplicationController
  responders :rabl
  respond_to :json

  def show
    respond_with task
  end

  protected

    def task
      @task ||= Task.find(params[:id])
    end
end

