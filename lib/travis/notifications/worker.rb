require 'resque'

module Travis
  module Notifications
    class Worker
      autoload :Payload, 'travis/notifications/worker/payload'
      autoload :Queue,   'travis/notifications/worker/queue'

      EVENTS = /job:.*:created/

      class << self
        def default_queue
          @default_queue ||= Queue.new('builds')
        end

        def queues
          @queues ||= Array(Travis.config.queues).compact.map do |queue|
            Queue.new(*queue.values_at(*[:queue, :slug, :target, :language]))
          end
        end

        def queue_for(job)
          slug = job.repository.slug
          target, language = job.config.values_at(:target, :language)
          queues.detect { |queue| queue.matches?(slug, target, language) } || default_queue
        end

        def payload_for(job, extra)
          Payload.new(job, extra).to_hash
        end
      end

      delegate :queue_for, :payload_for, :to => :'self.class'

      def notify(event, job, *args)
        enqueue(job.record)
      end

      protected

        def enqueue(job)
          queue = queue_for(job)
          payload_for(job, :queue => queue.name).tap do |payload|
            # TODO ::Rails.logger.info("Job queued to #{queue.name.inspect}: #{payload.inspect}")
            Resque.enqueue(queue, payload)
          end
        end
    end
  end
end
