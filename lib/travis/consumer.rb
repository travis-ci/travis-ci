require 'amqp'
require 'multi_json'
require 'hashr'
require 'benchmark'

module Travis
  class Consumer
    autoload :Handler, 'travis/consumer/handler'
    autoload :Job,     'travis/consumer/job'
    autoload :Worker,  'travis/consumer/worker'

    include Logging

    REPORTING_KEY = 'reporting.jobs'

    class << self
      def start(options = {})
        Database.connect(options)

        EM.run do
          prune_workers
          # cleanup_jobs
          subscribe
        end
      end

      def subscribe
        new.subscribe
      end

      def prune_workers
        interval = Travis.config.workers.prune.interval
        EM.add_periodic_timer(interval, &::Worker.method(:prune))
      end

      def cleanup_jobs
        interval = Travis.config.jobs.retry.interval
        EM.add_periodic_timer(interval, &::Job.method(:cleanup))
      end
    end

    attr_reader :config

    def initialize
      @config = Travis.config.amqp
    end

    def subscribe
      queue.subscribe(:ack => true, &method(:receive))
    end

    def receive(message, payload)
      log notice("Handling event #{message.type.inspect} with payload : #{payload.inspect}")

      event   = message.type
      payload = decode(payload)
      handler = handler_for(event, payload)

      benchmark_and_cache do
        handler.handle
      end

      message.ack
    rescue Exception => e
      puts e.message, e.backtrace
      message.ack
      # message.reject(:requeue => false) # how to decide whether to requeue the message?
    end

    def heartbeat(message, payload)
      log notice("Heartbeat: #{payload.inspect}")
      Worker.heartbeat
    end

    protected

      def handler_for(event, payload)
        case event.to_s
        when /^job/
          Job.new(event, payload)
        when /^worker/
          Worker.new(event, payload)
        else
          raise "Unknown message type: #{event.inspect}"
        end
      end

      def benchmark_and_cache
        timing = Benchmark.realtime do
          ActiveRecord::Base.cache { yield }
        end
        log notice("Completed in #{timing.round(4)} seconds")
      end

      def decode(payload)
        MultiJson.decode(payload)
      end

      def connection
        @connection ||= AMQP.start(config)
      end

      def channel
        @channel ||=  AMQP::Channel.new(connection).prefetch(config.prefetch)
      end

      def queue
        @queue ||= channel.queue(REPORTING_KEY, :durable => true, :exclusive => false)
      end
  end
end
