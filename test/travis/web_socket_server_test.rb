require 'test_helper'
require 'web_socket'
require 'travis/web_socket_server'

class TravisWebSocketServerTest < Test::Unit::TestCase
  attr_reader :server, :clients, :receivers, :messages

  def setup
    @receivers = []
    @messages  = [[], []]
    @server    = start_server
    @clients   = [start_client, start_client]
    start_receiving
  end

  def teardown
    receivers << server
    receivers.each { |thread| thread.kill if thread.respond_to?(:kill) }
    EM.stop if EM.reactor_running?
  end

  test "clients receive messages published to channels they have subscribed to" do
    clients[0].send('subscribe:{ "repository": [1,2,3] }')
    clients[1].send('subscribe:{ "repository": [1,4] }')

    Travis::WebSocketServer.publish(:repository_1, 'repository_1')
    Travis::WebSocketServer.publish(:repository_2, 'repository_2')
    Travis::WebSocketServer.publish(:repository_4, 'repository_4')
    sleep(0.1)

    assert_equal ['repository_1', 'repository_2'], messages[0]
    assert_equal ['repository_1', 'repository_4'], messages[1]
  end

  test "clients should not receive messages published to channels they have unsubscribed from" do
    clients[0].send('subscribe:{ "repository": [1,2] }')
    clients[0].send('unsubscribe:{ "repository": [2] }')

    Travis::WebSocketServer.publish(:repository_1, 'repository_1')
    Travis::WebSocketServer.publish(:repository_2, 'repository_2')
    sleep(0.1)

    assert_equal ['repository_1'], messages[0]
  end

  test "clients should not receive messages after they've been closed" do
    clients[0].send('subscribe:{ "repository": [1] }')
    clients[0].close

    Travis::WebSocketServer.publish(:repository_1, 'repository_1')
    sleep(0.1)

    assert messages[0].empty?
  end

  protected

    def start_server
      server = Thread.new do
        EM.run do
          begin
            sleep(0.01) until EM.reactor_running?
            Travis::WebSocketServer.start
          rescue Exception => e
            p e
          end
        end
      end
      sleep(0.01) until EM.reactor_running?
      server
    end

    def start_client
      WebSocket.new('ws://127.0.0.1:8080')
    end

    def start_receiving
      clients.each_with_index do |client, ix|
        receivers << Thread.new do
        # EM.defer do
          while true
            message = client.receive
            message = eval(JSON.parse(message)['body']) rescue nil
            messages[ix] << message if message
          end
        end
      end
    end
end
