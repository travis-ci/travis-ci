require 'rubygems'
require 'em/stdout'

EventMachine.module_eval do
  def self.split_stdout(&block)
    stdout = nil
    EM.next_tick do
      read, write = IO.pipe
      stdout = STDOUT.clone
      EM.attach(read, Splitter) { |c|
        c.stdout = stdout
        c.callback = block
      }
      STDOUT.reopen(write)
    end
    sleep(0.01) until stdout
    stdout
  end

  class Splitter < EventMachine::Connection
    attr_accessor :stdout, :callback

    def receive_data(data)
      callback.call(data)
    end

    def unbind
      STDOUT.reopen(stdout)
      stdout.puts "unbound"
    end
  end
end


STDOUT.sync = true

EM.run do
  EM.defer do
    stdout = EM.split_stdout do |data|
      stdout.puts '--: ' + data.inspect
      sleep(1)
    end

    stdout.puts 'starting'

    10.times { puts 'output ... '; sleep(0.2) }

    stdout.puts 'stopping'
    EM.stop
  end
end
puts 'fin'
