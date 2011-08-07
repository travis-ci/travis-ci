module Travis
  class Worker
    class << self
      def enqueue(task)
        worker  = worker_for(task)
        payload = payload_for(task)
        payload.merge!(:queue => worker.queue)

        ::Rails.logger.info("Job queued to #{worker.queue.inspect}: #{payload.inspect}")
        Resque.enqueue(worker, payload)
        payload
      end

      def to_s
        "Travis::Worker"
      end

      def queue
        "builds"
      end

      def queues
        @queues = Travis.config['queues'] || {}
      end

      def worker_for(build)
        queues.each do |queue|
          return Worker.const_get(queue['queue'].capitalize) if use_queue?(build, queue)
        end
        Worker
      end

      def payload_for(task)
        Travis.hash({ :build => task, :repository => task.repository }, :type => :job)
      end

      def use_queue?(build, config)
        slug, target = config['slug'], config['target']
        (build.repository.slug == slug) || (build.config && build.config[:target] && build.config[:target] == target)
      end

      def setup_custom_queues
        queues.each do |config|
          define_queue(config['queue']) unless has_queue?(config['queue'])
        end
      end

      def define_queue(name)
        worker = Class.new(Worker) do
          def self.queue
            name.demodulize.underscore
          end
        end
        Travis::Worker.const_set(name.capitalize, worker)
      end

      def has_queue?(name)
        args = [name.capitalize]
        # Ruby 1.9.2 const_defined? takes a second argument :inherit which defaults to true
        args << false if Worker.method(:const_defined?).arity != 1
        Worker.const_defined?(*args)
      end
    end

    send :setup_custom_queues

    self
  end
end
