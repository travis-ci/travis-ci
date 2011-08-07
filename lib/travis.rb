module Travis
  autoload :Config,        'travis/config'
  autoload :GithubApi,     'travis/github_api'
  autoload :Worker,        'travis/worker'
  autoload :Renderer,      'travis/renderer'
  autoload :Notifications, 'travis/notifications'

  class << self
    delegate :json, :hash, :to => 'Travis::Renderer'

    attr_accessor :pusher

    def config
      @config ||= Config.new
    end
  end
end
