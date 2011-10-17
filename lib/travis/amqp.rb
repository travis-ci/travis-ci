module Travis
  module Amqp
    QUEUE_PREFIX = "builds"

    class << self
      def setup_connection
        require "amqp/utilities/event_loop_helper"
        AMQP::Utilities::EventLoopHelper.run

        AMQP.start(Travis.config.amqp) do |connection|
          Rails.logger.info "Connected to AMQP broker"
          AMQP.channel = AMQP::Channel.new(connection)
        end
      end

      def publish(queue, payload)
        body = MultiJson.encode(payload)

        metadata = {
          :routing_key => "#{QUEUE_PREFIX}.#{queue}",
          :persistent => true
        }

        exchange.publish(body, metadata)
      end

      protected

        def exchange
          @exchange ||= AMQP.channel.default_exchange
        end
    end
  end
end
