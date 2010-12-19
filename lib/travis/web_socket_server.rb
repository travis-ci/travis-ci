# Opens a websocket server, takes un/subscriptions from clients to channels
# and distributes messages from the BuildListener to clients by channels

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

    def start(options = {})
      EventMachine.start_server('127.0.0.1', 8080, EventMachine::WebSocket::Connection, options) do |client|
        client.subscriptions = []
        client.onmessage { |message| client_message(client, message) }
        client.onclose { client_quit(client) }
      end
    end

    def publish(channel, data)
      # puts "publishing to #{channel.inspect}: #{data.to_json}"
      data = { :type => 'message', :body => data.to_json }.to_json # hmm, socky js wants this ...
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
          # puts "subscribing client #{client.object_id} to #{channel_id.inspect}"
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
