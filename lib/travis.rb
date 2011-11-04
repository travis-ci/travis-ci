autoload :Artifact,   'travis/model/artifact'
autoload :Build,      'travis/model/build'
autoload :Commit,     'travis/model/commit'
autoload :Job,        'travis/model/job'
autoload :Repository, 'travis/model/repository'
autoload :Request,    'travis/model/request'
autoload :Token,      'travis/model/token'
autoload :User,       'travis/model/user'
autoload :Worker,     'travis/model/worker'

module Travis
  autoload :Amqp,          'travis/amqp'
  autoload :Config,        'travis/config'
  autoload :Consumer,      'travis/consumer'
  autoload :Database,      'travis/database'
  autoload :GithubApi,     'travis/github_api'
  autoload :Logging,       'travis/logging'
  autoload :Mailer,        'travis/mailer'
  autoload :Notifications, 'travis/notifications'
  autoload :Record,        'travis/record'
  autoload :Renderer,      'travis/renderer'

  class << self
    attr_accessor :pusher

    def config
      @config ||= Config.new
    end
  end
end
