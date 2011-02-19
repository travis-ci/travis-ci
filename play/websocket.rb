require 'rubygems'
require 'web_socket'
require 'travis/web_socket_server'

EM.run do
  server = Thread.new do
    Travis::WebSocketServer.start
  end
  sleep(0.2)

  client_1 = WebSocket.new('ws://127.0.0.1:8080')
  client_2 = WebSocket.new('ws://127.0.0.1:8080')

  clients = Thread.new do
    while true
      msg = client_1.receive
      puts "client_1: #{msg}" if msg
      msg = client_2.receive
      puts "client_2: #{msg}" if msg
      sleep(0.01)
    end
  end

  client_1.send('subscribe:{ "repository": [1,2,3] }')
  client_2.send('subscribe:{ "repository": [1,4] }')

  Travis::WebSocketServer.publish(:repository_1, 'should get to client_1 and 2')
  Travis::WebSocketServer.publish(:repository_2, 'should get to client_1')
  Travis::WebSocketServer.publish(:repository_4, 'should get to client_2')
  sleep(0.2)

  client_1.close

  Travis::WebSocketServer.publish(:repository_1, 'should get to client_2')
  sleep(0.2)

  server.kill
  clients.kill

  EM.stop
end
