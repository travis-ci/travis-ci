module Travis
  module Notifications
    class Worker
      autoload :Queue, 'travis/notifications/worker/queue'

      EVENTS = 'task:finished'

      class << self
        def default_queue
          @default_queue ||= Queue.new('builds')
        end

        def queues
          @queues ||= Array(Travis.config.queues).compact.map do |queue|
            Queue.new(*queue.values_at(*[:queue, :slug, :target]))
          end
        end

        def queue_for(task)
          slug   = task.repository.slug
          target = task.config[:target]
          queues.detect { |queue| queue.matches?(slug, target) } || default_queue
        end

        def payload_for(task)
          Travis.hash({ :build => task, :repository => task.repository }, :type => :job)
        end
      end

      delegate :queue_for, :payload_for, :to => :'self.class'

      def notify(event, task, *args)
        enqueue(task)
      end

      protected

        def enqueue(task)
          queue   = queue_for(task)
          payload = payload_for(task)
          payload.merge!(:queue => queue.name)

          ::Rails.logger.info("Job queued to #{queue.name.inspect}: #{payload.inspect}")
          Resque.enqueue(queue, payload)
          payload
        end
    end
  end
end
