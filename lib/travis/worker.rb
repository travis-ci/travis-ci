# based on
# https://gist.github.com/7dd37cb802143d054cac
# https://gist.github.com/070c8a8056c66579acb1
# and https://gist.github.com/f5a0f28b087859b4dca8

# {
#   'queues' => [
#     {
#       'slug' => 'rails/rails', 'queue' => 'rails'
#     },
#     {
#       'target' => 'erlang', 'queue' => 'erlang'
#     }
#   ]
# }

module Travis
  class Worker

    class << self
      # Enqueues the job with Resque
      def enqueue(build)
        worker = worker_for(build)
        job_info = Travis::Utils.json_for(:job, build)
        job_info.merge!(:queue => worker.queue)
        ::Rails.logger.info("Job queued to #{worker.queue} : #{job_info.inspect}")
        Resque.enqueue(worker, job_info)
        job_info
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
        queues.each do |config|
          return Worker.const_get(config['queue'].capitalize) if use_queue?(build, config)
        end
        Worker
      end

      def use_queue?(build, config)
        slug, target = config['slug'], config['target']
        (build.repository.slug == slug) || (build.config && build.config['target'] && build.config['target'] == target)
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
