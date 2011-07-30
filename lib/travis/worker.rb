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
        Resque.enqueue(worker, Travis::Utils.json_for(:job, build))
      end

      def queues
        @queues = Travis.config['queues'] || {}
      end

      def worker_for(build)
        queues.each do |queue_details|
          return Worker.const_get(queue_details['queue'].capitalize) if use_queue?(build, queue_details)
        end
        Worker
      end

      def use_queue?(build, queue_details)
        slug, language = queue_details['slug'], queue_details['target']

        (build.repository.slug == slug) || (build.config && build.config['target'] == language)
      end

      def to_s
        "Travis::Worker"
      end

      def queue
        "builds"
      end

      def setup_custom_queues
        queues.each do |queue_details|
          name = queue_details['queue']
          next if Worker.constants.include?(name.capitalize.to_sym)
          worker = Class.new(Worker) do
            def self.queue
              name.demodulize.underscore
            end
          end
          Travis::Worker.const_set(name.capitalize, worker)
        end
      end
    end

    setup_custom_queues

    self
  end
end