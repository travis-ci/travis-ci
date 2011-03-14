class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :set_gitsha_header
  after_filter :prepare_unobtrusive_flash

  def index
    render :text => '', :layout => 'application'
  end

  protected
    def repositories
      @repositories ||= Repository.timeline
    end
    helper_method :repositories

    def workers
      @workers ||= Resque.workers.map { |worker| { :id => worker.to_s } }.compact
    end
    helper_method :workers

    def jobs
      @jobs ||= Resque.peek(:builds, 0, 50).map do |job|
        build = job['args'].last
        meta  = Travis::Builder.get_meta(job['args'].first)
        data  = build.slice('id', 'number', 'commit')
        data.update('repository' => (build['repository'] || {}).slice('id', 'name', 'url'))
        data.update(meta.data.slice('meta_id', 'enqueued_at'))
      end
    end
    helper_method :jobs

    def set_gitsha_header
      headers['X-Gitsha'] = TravisRails::Application::GIT_SHA
    end
end
