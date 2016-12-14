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

      def job(job)
        context.get "/jobs/#{job.id}", :format => :json
        json_response
      end
    end

    class Worker
      include Mocha::API

      attr_reader :context, :consumer

      def initialize(context)
        @context = context
        @consumer = Travis::Hub.new
      end

      def start!(job, data)
        consumer.receive(stub(:type => 'job:test:started', :ack => nil), MultiJson.encode(data.merge('id' => job.id))) # TODO should be 'job:configure:started' depending on the job type
        job.reload
      end

      def finish!(job, data)
        consumer.receive(stub(:type => 'job:test:finished', :ack => nil), MultiJson.encode(data.merge('id' => job.id)))
        job.reload
      end

      def log!(job, data)
        consumer.receive(stub(:type => 'job:test:log', :ack => nil), MultiJson.encode(data.merge('id' => job.id)))
        job.reload
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
      @job = Request.first.job
    end

    def next_job!
      Job::Test.where(:state => :created).first.tap { |job| @job = job if job }
    end

    def job
      @job
    end

    def repository
      _request.repository
    end

    def _request
      job.is_a?(Job::Configure) ? job.owner : job.owner.request
    end

    def build
      job.is_a?(Job::Configure) ? _request.builds.first : job.owner
    end
  end
end

