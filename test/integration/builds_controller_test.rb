require 'test_helper_rails'

class BuildsControllerTest < ActionDispatch::IntegrationTest
  class ChannelMock; def trigger(*); end; end

  attr_reader :channel, :build

  def setup
    super
    flush_redis
    @build = Factory(:build)
    @channel = ChannelMock.new
    Pusher.stubs(:[]).returns(channel)
  end

  test 'POST to /builds (ping from github) creates a build record and a build job and sends a build:queued event to Pusher' do
    channel.expects(:trigger) # TODO uh, this doesn't seem to test anything
    assert_difference('Build.count', 1) do
      ping_from_github!
      assert_build_job
    end
  end

  test 'PUT to /builds/:id configures the build and expands a given build matrix' do
    configure_from_worker!
    assert_build_matrix_configured
  end

  test 'PUT to /builds/:id starts the build' do
    start_from_worker!
    assert_build_started
  end

  test 'PUT to /builds/:id/log appends to the build log' do
    build.update_attributes!(:log => 'some log')
    log_from_worker!
    assert_equal 'some log ... appended', build.log
  end

  test 'PUT to /builds/:id finishes the build' do
    finish_from_worker!
    assert_build_finished
  end

  test 'walkthrough from Github ping to finished build' do
    ping_from_github!
    assert_build_job

    start_from_worker!
    assert_build_started

    3.times { log_from_worker! }
    assert_equal ' ... appended ... appended ... appended', build.log

    finish_from_worker!
    assert_build_finished
  end

  protected
    def ping_from_github!
      post '/builds', { :payload => GITHUB_PAYLOADS['gem-release'] }, 'HTTP_AUTHORIZATION' => credentials
    end

    def configure_from_worker!
      authenticated_put(build_path(build), WORKER_PAYLOADS[:configured])
      build.reload
    end

    def start_from_worker!
      authenticated_put(build_path(build), WORKER_PAYLOADS[:started])
      build.reload
    end

    def log_from_worker!
      authenticated_put(log_build_path(build), WORKER_PAYLOADS[:log])
      build.reload
    end

    def finish_from_worker!
      authenticated_put(build_path(build), WORKER_PAYLOADS[:finished])
      build.reload
    end

    def assert_build_job
      args = Resque.reserve(:builds).args.last
      build = Build.last
      assert_equal '9854592', build.commit
      assert_equal build.attributes.slice('id', 'commit'), args.slice('id', 'commit')
      assert_equal build.repository.attributes.slice('id', 'url'), args['repository'].slice('id', 'url')
    end

    def assert_build_started
      assert build.started?, 'should have started the build'
    end

    def assert_build_matrix_configured
      expected_configs = [
        { 'rvm' => '1.8.7', 'gemfile' => 'gemfiles/rails-2.3.x' },
        { 'rvm' => '1.8.7', 'gemfile' => 'gemfiles/rails-3.0.x' },
        { 'rvm' => '1.9.2', 'gemfile' => 'gemfiles/rails-2.3.x' },
        { 'rvm' => '1.9.2', 'gemfile' => 'gemfiles/rails-3.0.x' }
      ]
      assert_equal expected_configs, build.matrix.map(&:config)
      assert_equal 'rake', build.config['script']
      # TODO assert resque jobs
    end

    def assert_build_finished
      assert build.finished?, 'should have finished the build'
      assert_equal 'final build log', build.log
      assert_equal 1, build.status
    end

    def authenticated_put(url, data)
      put url, data, 'HTTP_AUTHORIZATION' => credentials
    end

    def credentials
      ActionController::HttpAuthentication::Basic.encode_credentials(user.login, user.tokens.first.token)
    end

    def user
      @user ||= User.create!(:login => 'user').tap { |user| user.tokens.create! }
    end
end

