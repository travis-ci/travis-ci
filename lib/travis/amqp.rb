module Travis
  module Amqp
    class << self
      def setup_connection
        require "amqp/utilities/event_loop_helper"
        AMQP::Utilities::EventLoopHelper.run

        AMQP.start(Travis.config.amqp) do |connection|
          Rails.logger.info "Connected to AMQP broker"
          AMQP.channel = AMQP::Channel.new(connection)
        end
      end
    end
  end
end