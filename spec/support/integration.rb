module Support
  module Integration
    class Api
      include Support::Formats

      delegate :last_response, :get, :to => :context

      attr_reader :context

      def initialize(context)
        @context = context
      end

      def repositories
        context.get '/repositories', :format => :json
        json_response
      end

      def build(build)
        context.get "/builds/#{build.id}", :format => :json
        json_response
      end

      def task(task)
        context.get "/tasks/#{task.id}", :format => :json
        json_response
      end
    end

    class Worker
      attr_reader :context

      delegate :put, :to => :context

      def initialize(context)
        @context = context
      end

      def start!(task, data)
        Resque.pop('builds')
        put "/builds/#{task.id}", data
        task.reload
      end

      def finish!(task, data)
        put "/builds/#{task.id}", data
        task.reload
      end

      def log!(task, data)
        put "/builds/#{task.id}/log", data
        task.reload
      end
    end

    def api
      @api ||= Api.new(self)
    end

    def worker
      @worker ||= Worker.new(self)
    end

    def ping_from_github!
      authorize 'test', 'test'
      post '/builds', :payload => GITHUB_PAYLOADS['gem-release']
      @task = Request.first.task
    end

    def next_task!
      # Task::Test.where(:state => 'created').first # TODO bug in simple_states?
      Task::Test.where(:state => nil).first.tap { |task| @task = task if task }
    end

    def task
      @task
    end

    def repository
      _request.repository
    end

    def _request
      task.is_a?(Task::Configure) ? task.owner : task.owner.request
    end

    def build
      task.is_a?(Task::Configure) ? _request.builds.first : task.owner
    end
  end
end

