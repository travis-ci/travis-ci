module Travis
  autoload :Config,        'travis/config'
  autoload :Utils,         'travis/utils'
  autoload :Worker,        'travis/worker'
  autoload :Notifications, 'travis/notifications'

  class << self
    attr_accessor :pusher

    def config
      @config ||= Config.new
    end
  end

  class Worker
  end
end
