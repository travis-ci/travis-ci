class QueuesController < ApplicationController
  respond_to :json

  def index
    respond_with jobs
  end

  protected

    def jobs
      Job.where(:queue => params[:queue]).map do |job|
        {
          :id         => job.id,
          :number     => job.number,
          :commit     => job.commit.commit,
          :queue      => job.queue,
          :repository => {
            :id   => job.repository.id,
            :slug => job.repository.slug
          }
        }
      end
    end
end
