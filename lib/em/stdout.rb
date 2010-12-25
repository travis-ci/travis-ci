require 'eventmachine'

module EM
  class Stdout
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
      @read, @write = IO.pipe
      @stdout = STDOUT.dup
      @callback = callback
      STDOUT.reopen(write)
      EM.next_tick { pipe! }
    end

    def split
      yield
      close
    rescue Exception => e
      close
      stdout.puts e.message
      e.backtrace.each { |line| stdout.puts line }
    # ensure
    #   sleep(0.1) until read.eof?
    end

    def close
      STDOUT.reopen(stdout)
      write.close if write && !write.closed?
    end

    protected

      def pipe!
        unless read.eof?
          data = read.readpartial(1024)
          stdout << data if self.class.output
          callback.call(data)
          sleep(0.5)
        end
      rescue Exception => e
        stdout.puts e.message
        e.backtrace.each { |line| stdout.puts line }
      ensure
        EM.next_tick { pipe! }
      end
  end
end
