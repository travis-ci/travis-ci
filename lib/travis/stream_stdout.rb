require 'eventmachine'

module Travis
  class StreamStdout
    class << self
      def output
        defined?(@@output) ? @@output : @@output = true
      end

      def output=(output)
        @@output = output
      end
    end

    attr_reader :read, :write, :stdout, :callback

    def initialize(&callback)
      @callback = callback
      @read, @write = IO.pipe
      @stdout = STDOUT.dup
      STDOUT.reopen(write)
      EM.next_tick(&reader)
    end

    def reader
      @reader = lambda do
        unless read.eof?
          data = read.readpartial(1024)
          stdout << data if self.class.output
          callback.call(data)
        end
        EM.next_tick(&reader)
      end
    end

    def close
      write.close
      STDOUT.reopen(stdout)
    end

    def closed?
      write.closed?
    end
  end
end
