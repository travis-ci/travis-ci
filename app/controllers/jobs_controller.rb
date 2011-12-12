require 'responders'

class JobsController < ApplicationController
  responders :rabl
  respond_to :json

  def index
    respond_with jobs
  end

  def show
    respond_with job
  end

  protected

    def jobs
      @jobs ||= Job.queued.where(:queue => params[:queue])
      # .map do |job|
      #   {
      #     :id         => job.id,
      #     :number     => job.number,
      #     :commit     => job.commit.commit,
      #     :queue      => job.queue,
      #     :repository => {
      #       :id   => job.repository.id,
      #       :slug => job.repository.slug
      #     }
      #   }
      # end
    end

    def job
      @job ||= Job.find(params[:id])
    end
end

