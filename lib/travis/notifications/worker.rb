module Travis
  module Notifications
    class Worker
      autoload :Payload, 'travis/notifications/worker/payload'
      autoload :Queue,   'travis/notifications/worker/queue'

      EVENTS = /job:.*:created/

      class << self
        def enqueue(job)
          new.enqueue(job)
        end

        def amqp
          @amqp ||= Travis::Amqp
        end

        def amqp=(amqp)
          @amqp = amqp
        end

        def default_queue
          @default_queue ||= Queue.new('ruby')
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

      delegate :amqp, :queue_for, :payload_for, :to => :'self.class'

      def notify(event, job, *args)
        enqueue(job)
      end

      def enqueue(job)
        queue = queue_for(job).name
        payload_for(job, :queue => queue).tap do |payload|
          # TODO ::Rails.logger.info("Job queued to #{queue.name.inspect}: #{payload.inspect}")
          amqp.publish(queue, payload)
        end
      end
    end
  end
end
