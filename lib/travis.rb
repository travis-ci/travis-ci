require 'resque/plugins/meta'

module Travis
  autoload :Buildable,    'travis/buildable'
  autoload :Builder,      'travis/builder'
  autoload :Config,       'travis/config'
  autoload :Synchronizer, 'travis/synchronizer'

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
