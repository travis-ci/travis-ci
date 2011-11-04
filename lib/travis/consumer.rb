require 'amqp'
require 'multi_json'
require 'hashr'

module Travis
  class Consumer
    autoload :Job, 'travis/consumer/job'

    include Logging

    ROUTING_KEY = 'reporting.jobs'

    class << self
      def start(options = {})
        Database.connect(options)
        EventMachine.run { new.subscribe }
      end
    end

    attr_reader :config

    def initialize
      @config = Travis.config.amqp
    end

    def subscribe
      queue.subscribe(:ack => true, :blocking => false, &method(:receive))
    end

    def receive(message, payload)
      log "Handling event #{message.type.inspect} with payload : #{payload.inspect}"

      event   = message.type
      handler = handler_for(event)

      ActiveRecord::Base.cache do
        handler.handle(event, decode(payload))
      end

      message.ack
    rescue Exception => e
      puts e.message, e.backtrace
      message.ack
      # message.reject(:requeue => false) # how to decide whether to requeue the message?
    end

    protected

      def handler_for(event)
        case event.to_s
        when /^job/
          Job.new
        else
          raise "Unknown message type: #{event.inspect}"
        end
      end

      def decode(payload)
        Hashr.new(MultiJson.decode(payload))
      end

      def connection
        @connection ||= AMQP.start(config)
      end

      def channel
        @channel ||=  AMQP::Channel.new(connection).prefetch(config.prefetch)
      end

      def queue
        @queue ||= channel.queue(ROUTING_KEY, :durable => true, :exclusive => false)
      end
  end
end
