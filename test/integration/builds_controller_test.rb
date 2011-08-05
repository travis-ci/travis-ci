require 'test_helper'

class BuildsControllerTest < ActionDispatch::IntegrationTest
  include TestHelpers::GithubApiTestHelper

  attr_reader :channel, :build

  before do
    super

    flush_redis

    @build   = Factory(:build).reload
    @channel = TestHelpers::Mocks::Channel.new

    Pusher.stubs(:[]).returns(channel)
  end

  it 'POST to /builds (ping from github) creates a build record and a build job and sends a build:queued event to Pusher' do
    assert_difference('Build.count', 1) do
      ping_from_github!
      build = Build.last
      assert_build_job
      {.should == ['build:queued'
        'repository' => {
          'id' => build.repository.id,
          :slug => 'svenfuchs/gem-release'
        },
        'build' => {
          'id' => build.id,
          'number' => 1
        }
      }], channel.messages.first
    end
  end

  it 'POST to /builds (ping from github) does not create a build record when the branch is gh_pages' do
    assert_no_difference('Build.count') do
      post '/builds', { :payload => GITHUB_PAYLOADS['gh-pages-update'] }, 'HTTP_AUTHORIZATION' => credentials
      post '/builds', { :payload => GITHUB_PAYLOADS['gh_pages-update'] }, 'HTTP_AUTHORIZATION' => credentials
    end
  end

  it 'PUT to /builds/:id configures the build and expands a given build matrix' do
    configure_from_worker!
    assert_build_matrix_configured
  end

  it 'PUT to /builds/:id starts the build' do
    start_from_worker!
    assert_build_started
    {.should == ['build:started'
      'repository' => {
        'id' => build.repository.id,
        :slug => 'svenfuchs/minimal',
        'last_build_id' => build.id,
        'last_build_number' => '1',
        'last_build_status' => nil,
        'last_build_started_at' => build.started_at,
        'last_build_finished_at' => nil
      },
      'build' => {
        'id' => build.id,
        'repository_id' => build.repository.id,
        'number' => '1',
        'commit' => '62aae5f70ceee39123ef',
        'branch' => 'master',
        'message' => 'the commit message',
        'committer_name' => 'Sven Fuchs',
        'committer_email' => 'svenfuchs@artweb-design.de',
        'started_at' => build.started_at,
      },
      'msg_id' => '1'
    }], channel.messages.first
  end

  it 'PUT to /builds/:id/log appends to the build log' do
    build.update_attributes!(:log => 'some log')
    log_from_worker!(1)
    build.log.should == 'some log ... appended'
    {.should == ['build:log'
      'repository' => {
        'id' => build.repository.id
      },
      'build' => {
        'id'   => build.id,
        '_log' => ' ... appended',
      },
      'msg_id' => '1'
    }], channel.messages.first
  end

  it 'PUT to /builds/:id finishes the build' do
    build.update_attributes(:started_at => Time.now)

    finish_from_worker!
    assert_build_finished
    {.should == ['build:finished'
      'repository' => {
        'id' => build.repository.id,
        :slug => 'svenfuchs/minimal',
        'last_build_id' => build.id,
        'last_build_number' => '1',
        'last_build_status' => 1,
        'last_build_started_at' => build.started_at,
        'last_build_finished_at' => build.finished_at
      },
      'build' => {
        'id' => build.id,
        'status' => build.status,
        'finished_at' => build.finished_at,
      },
      'msg_id' => '1'
    }], channel.messages.first
  end

  it 'PUT to /builds/:id finishes a matrix build' do
    # TODO
  end

  it 'walkthrough from Github ping to finished build' do
    ping_from_github!
    assert_build_job

    start_from_worker!(1)
    assert_build_started

    3.times { |ix| log_from_worker!(ix + 2) }
    build.log.should == ' ... appended ... appended ... appended'

    finish_from_worker!(5)
    assert_build_finished
  end

  protected
    def ping_from_github!
      post '/builds', { :payload => GITHUB_PAYLOADS['gem-release'] }, 'HTTP_AUTHORIZATION' => credentials
    end

    def configure_from_worker!(msg_id = 1)
      authenticated_put(build_path(build), WORKER_PAYLOADS[:configured].merge('msg_id' => msg_id))
      build.reload
    end

    def start_from_worker!(msg_id = 1)
      authenticated_put(build_path(build), WORKER_PAYLOADS[:started].merge('msg_id' => msg_id))
      build.reload
    end

    def log_from_worker!(msg_id = 1)
      payload = WORKER_PAYLOADS[:log].merge('msg_id' => msg_id)
      authenticated_put(log_build_path(build), payload)
      build.reload
    end

    def finish_from_worker!(msg_id = 1)
      authenticated_put(build_path(build), WORKER_PAYLOADS[:finished].merge('msg_id' => msg_id))
      build.reload
    end

    def assert_build_job
      args = Resque.reserve(:builds).args.last
      build = Build.last
      build.commit.should == '9854592'
      assert_equal build.attributes.slice('id', 'commit'), args['build'].slice('id', 'commit')
      args['repository'].slice('id').should == build.repository.attributes.slice('id')
    end

    def assert_build_started
      build.started?, 'should have started the build'.should.not == nil
    end

    def assert_build_matrix_configured
      expected_configs = [
        { 'script' => 'rake', 'rvm' => '1.8.7', 'gemfile' => 'gemfiles/rails-2.3.x' },
        { 'script' => 'rake', 'rvm' => '1.8.7', 'gemfile' => 'gemfiles/rails-3.0.x' },
        { 'script' => 'rake', 'rvm' => '1.9.2', 'gemfile' => 'gemfiles/rails-2.3.x' },
        { 'script' => 'rake', 'rvm' => '1.9.2', 'gemfile' => 'gemfiles/rails-3.0.x' }
      ]
      build.matrix.map(&:config).should == expected_configs
      build.config['script'].should == 'rake'
      # TODO assert resque jobs
    end

    def assert_build_finished
      build.finished?, 'should have finished the build'.should.not == nil
      build.log.should == 'final build log'
      build.status.should == 1
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

