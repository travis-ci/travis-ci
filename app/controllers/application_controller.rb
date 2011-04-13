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
        job['args'].last.tap do |data|
          data['repository'].slice!('id', 'slug')
          data.update(data['build'].slice('id', 'number', 'commit'))
          data.delete('build')
        end
        # meta  = Travis::Builder.get_meta(job['args'].first)
        # data.update(meta.data.slice('meta_id', 'enqueued_at'))
      end
    end
    helper_method :jobs

    def set_gitsha_header
      headers['X-GIT_SHA'] = TravisCi::Application::GIT_SHA
    end

end
