require 'travis'

class TasksController < ApplicationController
  responders :rabl
  respond_to :json

  def show
    respond_with task
  end

  # also responds to PUT /builds/:id legacy route
  def update
    task.update_attributes(params[:task] || params[:build])
    render :nothing => true
  end

  # also responds to PUT /builds/:id/log legacy route
  def log
    Task.append_log!(params[:id], params[:task] ? params[:task][:log] : params[:build][:log])
    render :nothing => true
  end

  protected

    def task
      @task ||= Task.find(params[:id])
    end
end

