module Travis
  autoload :Buildable, 'travis/buildable'
  autoload :Builder,   'travis/builder'
  autoload :Config,    'travis/config'

  class << self
    def config
      @config ||= Config.new
    end
  end
end
