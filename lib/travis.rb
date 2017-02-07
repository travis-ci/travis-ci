require 'responders'

module Travis
  autoload :Config,        'travis/config'
  autoload :GithubApi,     'travis/github_api'
  autoload :Notifications, 'travis/notifications'
  autoload :Renderer,      'travis/renderer'

  class << self
    attr_accessor :pusher

    def config
      @config ||= Config.new
    end
  end
end
