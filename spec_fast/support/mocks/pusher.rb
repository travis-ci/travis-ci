module Support
  module Mocks
    class Pusher
      attr_accessor :messages

      def initialize
        @messages = []
      end

      def trigger(*args)
        messages << args
      end

      def reset!
        @messages = []
      end
      alias :clear! :reset!
    end
  end
end


