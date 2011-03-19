module Mocks
  class Buildable
    def configure; end
    def run!; end
  end

  class Connection
    def callback; end
    def errback; end
  end

  class Pusher
    attr_accessor :messages
    def initialize
      @messages = []
    end

    def push(*args)
      messages << args
    end
  end
end
