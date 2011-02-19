module Travis
  autoload :Buildable, 'travis/buildable'
  autoload :Builder,   'travis/builder'
  autoload :Config,    'travis/config'
  autoload :WebSocketServer, 'travis/web_socket_server'

  class << self
    def config
      @config ||= Config.new
    end
  end
end
