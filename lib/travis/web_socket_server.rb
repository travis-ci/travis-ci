require 'eventmachine'
require 'em-websocket'
require 'json'

EventMachine::WebSocket::Connection.class_eval do
  attr_accessor :subscriptions
end

module Travis
  class WebSocketServer
    class << self
      def method_missing(method, *args, &block)
        @instance ||= new
        @instance.send(method, *args, &block)
      end
    end

    attr_reader :channels

    def initialize
      @channels = {}
    end

    def start
      EventMachine::WebSocket.start(:host => '127.0.0.1', :port => 8080) do |client|
        client.subscriptions = []
        client.onmessage { |message| client_message(client, message) }
        client.onclose { client_quit(client) }
      end
    end

    def publish(channel, data)
      channels[channel].push(data) if channels.key?(channel)
    end

    def client_message(client, message)
      message = message.split(':')
      handler = :"client_#{message.shift}"
      send(handler, client, JSON.parse(message.join(':'))) if respond_to?(handler)
    end

    def client_subscribe(client, data)
      data.each do |type, ids|
        ids.each do |id|
          channel_id = :"#{type}_#{id}"
          channel = channels[channel_id] ||= EventMachine::Channel.new
          subscription_id = channel.subscribe { |message| client.send(message) }
          client.subscriptions << [channel_id, subscription_id]
        end
      end
    end

    def client_unsubscribe(client, data)
      data.each do |type, ids|
        ids.each do |id|
          channel_id = :"#{type}_#{id}"
          subscription = client.subscriptions.assoc(channel_id)
          channel = channels[channel_id]
          channel.unsubscribe(subscription[1]) if subscription && channel
        end
      end
    end

    def client_quit(client)
      client.subscriptions.each do |(channel_id, subscription_id)|
        if channel = channels[channel_id]
          channel.unsubscribe(subscription_id)
        end
      end
    end
  end
end
