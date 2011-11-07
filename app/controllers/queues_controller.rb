class QueuesController < ApplicationController
  respond_to :json

  def index
    respond_with jobs
  end

  protected

    def jobs
      queue.jobs.map do |job|
        {
          :id         => job.id,
          :number     => job.number,
          :commit     => job.commit.commit,
          :repository => {
            :id   => job.repository.id,
            :slug => job.repository.slug
          }
        }
      end
    end

    def queue
      queues.detect { |queue| queue.name == params[:queue] } || default_queue
    end

    def queues
      Travis::Notifications::Worker.queues
    end

    def default_queue
      Travis::Notifications::Worker.default_queue
    end
end
