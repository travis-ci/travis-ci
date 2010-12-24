class StdoutSplit
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
    split!
  end

  def capture
    begin
      result = yield
    rescue Exception => e
      close
      stdout.puts e.message
      e.backtrace.each { |line| stdout.puts line }
    ensure
      close
    end
  end

  def close
    STDOUT.reopen(stdout)
    write.close if write && !write.closed?
  end

  protected

    def split!
      STDOUT.reopen(write)

      Thread.new do
        while true
          begin
            unless read.eof?
              data = read.readpartial(1024)
              stdout << data if self.class.output
              callback.call(data)
            end
          rescue Exception => e
            stdout.puts e.message
            e.backtrace.each { |line| stdout.puts line }
          end
        end
      end
    end
end
