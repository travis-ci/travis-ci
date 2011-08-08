require 'responders'

module Travis
  autoload :Config,        'travis/config'
  autoload :GithubApi,     'travis/github_api'
  autoload :Notifications, 'travis/notifications'
  autoload :Renderer,      'travis/renderer'

  class << self
    delegate :json, :hash, :to => 'Travis::Renderer'

    attr_accessor :pusher

    def config
      @config ||= Config.new
    end
  end
end
