module Mocks
  class Buildable
    def configure; end
    def run!; end
  end

  class Connection
    def callback; end
    def errback; end
  end

  class Channel
    attr_accessor :messages
    def initialize
      @messages = []
    end

    def trigger(*args)
      messages << args
    end
  end

  class Patron
    attr_accessor :requests
    def initialize
      @requests = []
    end

    def post(*args)
      requests << [:post, *args]
    end
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
