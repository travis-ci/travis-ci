require 'amqp'
require 'multi_json'
require 'hashr'

module Travis
  class Consumer
    autoload :Task, 'travis/consumer/task'

    ROUTING_KEY = 'reporting.jobs'

    def self.start
      new.subscribe
    end

    attr_reader :config

    def initialize
      @config = Travis.config.amqp
    end

    def subscribe
      queue.subscribe(:ack => true, :blocking => false, &method(:receive))
    end

    def receive(message, payload)
      event   = message.type
      handler = handler_for(event)
      handler.handle(event, decode(payload))
      message.ack
    rescue Exception => e
      puts e.message, e.backtrace
      # message.ack
    #   message.reject(:requeue => false) # how to decide whether to requeue the message?
    end

    protected

      def handler_for(event)
        case event.to_s
        when /^job/
          Task.new
        else
          raise "Unknown message type: #{event.inspect}"
        end
      end

      def decode(payload)
        Hashr.new(MultiJson.decode(payload))
      end

      def connection
        @connection ||= AMQP.start(:host=>"jqnzvgcp.heroku.srs.rabbitmq.com", :port=>11154, :user=>"gnbejyjk", :pass=>"PlVYL1zfG7897ijg", :vhost=>"jqnzvgcp")
      end

      def channel
        @channel ||=  AMQP::Channel.new(connection).prefetch(config.prefetch)
      end

      def queue
        @queue ||= channel.queue(ROUTING_KEY, :durable => true, :exclusive => false)
      end
  end
end
