module Travis
  autoload :Config,   'travis/config'
  autoload :Strategy, 'travis/strategy'

  class << self
    attr_accessor :pusher

    def config
      @config ||= Config.new
    end
  end

  class Worker
  end
end
