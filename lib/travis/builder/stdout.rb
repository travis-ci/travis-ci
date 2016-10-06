require 'em/stdout'

module Travis
  class Builder
    module Stdout
      class Buffer < String
        def read_pos
          @read_pos ||= 0
        end

        def read
          string = self[read_pos, length - read_pos]
          @read_pos += string.length
          string
        end

        def empty?
          read_pos == length
        end
      end

      BUFFER_TIME = 0.25

      attr_reader :stdout, :buffer

      def initialize(*)
        super
        @buffer = Buffer.new
      end

      def work!
        $_stdout = @stdout = EM.split_stdout do |c|
          if buffer?
            c.callback { |data| buffer << data }
            c.on_close { flush }
          else
            c.callback { |data| on_log(data) }
          end
        end
        EventMachine.add_periodic_timer(BUFFER_TIME) { flush } if buffer?
        super
      end

      def flush
        on_log(buffer.read) unless buffer.empty?
      end

      def buffer?
        BUFFER_TIME.to_f > 0
      end
    end
  end
end

