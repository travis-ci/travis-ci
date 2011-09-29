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
      include Mocha::API

      attr_reader :context, :consumer

      def initialize(context)
        @context = context
        @consumer = Travis::Consumer.new
      end

      def start!(task, data)
        Resque.pop('builds')
        consumer.receive(stub(:type => 'task:test:started', :ack => nil), MultiJson.encode(data.merge('id' => task.id))) # TODO should be 'task:configure:started' depending on the task type
        task.reload
      end

      def finish!(task, data)
        consumer.receive(stub(:type => 'task:test:finished', :ack => nil), MultiJson.encode(data.merge('id' => task.id)))
        task.reload
      end

      def log!(task, data)
        consumer.receive(stub(:type => 'task:test:log', :ack => nil), MultiJson.encode(data.merge('id' => task.id)))
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

