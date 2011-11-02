module Support
  module Mocks
    class Amqp
      attr_accessor :messages

      def initialize
        @messages = []
      end

      def publish(*args)
        messages << args
      end
    end

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

    class Irc
      def initialize
        @output = []
      end

      def join(channel, password = nil, &block)
        @channel = "##{channel}"
        password = password && " #{password}" || ""

        say "JOIN #{@channel}#{password}"

        instance_eval(&block) and leave if block_given?
      end

      def run(&block)
        instance_eval(&block) if block_given?
      end

      def leave
        say "PART #{@channel}"
      end

      def say(message)
        say "PRIVMSG #{@channel} :#{message}" if @channel
      end

      def quit
        say "QUIT"
      end

      def say(output)
        @output << output
      end

      def output
        @output
      end
    end
  end
end

