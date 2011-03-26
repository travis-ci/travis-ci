require 'em/stdout'

module Travis
  class Builder
    module Stdout
      class Buffer < String
        def read
          @read_pos ||= 0
          string = self[@read_pos, length - @read_pos]
          @read_pos += string.length
          string
        end
      end

      BUFFER_TIME = 2

      attr_reader :stdout, :buffer

      def initialize(*)
        super
        @buffer = Buffer.new
      end

      def work!
        $_stdout = @stdout = EM.split_stdout do |c|
          c.callback { |data| buffer << data }
          c.on_close { flush }
        end
        EventMachine.add_periodic_timer(BUFFER_TIME) { flush }
        super
      end

      def flush
        on_log(buffer.read) unless buffer.empty?
      end
    end
  end
end

