require 'resque_helpers'

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

    def workers
      @workers ||= ResqueHelpers.active_workers
    end
    helper_method :workers

    def jobs
      @jobs ||= ResqueHelpers.queued_jobs(params[:queue])
    end
    helper_method :jobs

    def set_gitsha_header
      headers['X-GIT_SHA'] = ENV['GIT_SHA'] if ENV['GIT_SHA']
    end

    def not_found
      raise ActionController::RoutingError.new('Not Found')
    end
end
