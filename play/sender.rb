require 'rubygems'
require 'eventmachine'

class Sender < EventMachine::Connection
  attr_reader :connection

  def initialize
    @connection = EM.connect('127.0.0.1', 9797)
  end

  def receive_data(data)
    connection.send_data(data)
  end

  def unbind
    EM.stop
  end
end

EM.run do
  EM.attach $stdin, Sender
end

# ruby -e '$stdout.sync = true; 10.times { print "."; sleep(0.5) }' | ruby sender.rb
