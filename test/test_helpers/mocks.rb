module TestHelpers
  module Mocks
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

    class EmHttpRequest
      attr_accessor :requests

      def initialize(*args)
        @requests = []
      end

      def post(*args)
        requests << [:post, *args]
        EM.next_tick { @callback.call(self) if @callback }
        return self
      end

      def callback(&block)
        @callback = block
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
end