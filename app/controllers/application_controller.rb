class ApplicationController < ActionController::Base
  prepend_view_path 'app/views/v1/default'

  protect_from_forgery

  before_filter :set_gitsha_header
  after_filter  :prepare_unobtrusive_flash

  protected

    def repositories
      @repositories ||= Repository.timeline
    end
    helper_method :repositories

    def jobs(queue=nil)
      queue   = Travis::Notifications::Worker.queues.select { |queue| queue.name == queue_name }.first
      queue ||= Travis::Notifications::Worker.default_queue
      queue.jobs.collect do |job|
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
    helper_method :jobs

    def set_gitsha_header
      headers['X-GIT_SHA'] = ENV['GIT_SHA'] if ENV['GIT_SHA']
    end

    def not_found
      raise ActionController::RoutingError.new('Not Found')
    end
end
