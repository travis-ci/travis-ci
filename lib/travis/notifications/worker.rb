module Travis
  module Notifications
    class Worker
      autoload :Payload, 'travis/notifications/worker/payload'
      autoload :Queue,   'travis/notifications/worker/queue'

      EVENTS = /task:.*:created/

      class << self
        def default_queue
          @default_queue ||= Queue.new('builds')
        end

        def queues
          @queues ||= Array(Travis.config.queues).compact.map do |queue|
            Queue.new(*queue.values_at(*[:queue, :slug, :target, :language]))
          end
        end

        def queue_for(task)
          slug = task.repository.slug
          target, language = task.config.values_at(:target, :language)
          queues.detect { |queue| queue.matches?(slug, target, language) } || default_queue
        end

        def payload_for(task, extra)
          Payload.new(task, extra).to_hash
        end
      end

      delegate :queue_for, :payload_for, :to => :'self.class'

      def notify(event, task, *args)
        enqueue(task)
      end

      protected

        def enqueue(task)
          queue   = queue_for(task)
          payload = payload_for(task, :queue => queue.name)

          ::Rails.logger.info("Job queued to #{queue.name.inspect}: #{payload.inspect}")
          Resque.enqueue(queue, payload)

          payload
        end
    end
  end
end
