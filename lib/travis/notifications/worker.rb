module Travis
  module Notifications
    class Worker
      autoload :Queue, 'travis/notifications/worker/queue'

      EVENTS = /task:.*:created/

      class Payload
        attr_reader :task, :extra

        def initialize(task, extra = {})
          @task, @extra = task, extra
        end

        def to_hash
          render(:hash)
        end

        def render(format)
          Travis.send(format, data, :type => :job, :template => template).first.deep_merge(extra) # TODO wtf is this an array??
        end

        def data
          { :task => task, :repository => task.repository }
        end

        def template
          task.class.name.underscore
        end
      end

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
