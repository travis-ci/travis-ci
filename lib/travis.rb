require 'resque/plugins/meta'

module Travis
  autoload :Config,       'travis/config'

  class << self
    attr_accessor :pusher

    def config
      @config ||= Config.new
    end
  end

  class Worker
    extend Resque::Plugins::Meta
  end
end
