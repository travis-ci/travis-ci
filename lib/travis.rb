autoload :Build,      'travis/record/build'
autoload :Commit,     'travis/record/commit'
autoload :Job,        'travis/record/job'
autoload :Repository, 'travis/record/repository'
autoload :Request,    'travis/record/request'
autoload :Token,      'travis/record/token'
autoload :User,       'travis/record/user'

module Travis
  autoload :Config,        'travis/config'
  autoload :Consumer,      'travis/consumer'
  autoload :GithubApi,     'travis/github_api'
  autoload :Mailer,        'travis/mailer'
  autoload :Model,         'travis/model'
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
