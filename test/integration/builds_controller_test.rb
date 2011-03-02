require 'test_helper'

module IntegrationTestHelper
  def user
    @user ||= User.create!(:login => 'user').tap { |user| user.tokens.create! }
  end

  def credentials
    ActionController::HttpAuthentication::Basic.encode_credentials(user.login, user.tokens.first.token)
  end

  def post_from_github!
    post '/builds', { :payload => GITHUB_PAYLOADS['gem-release'] }, 'HTTP_AUTHORIZATION' => credentials
  end

  def authenticated_put(url, data)
    put url, data, 'HTTP_AUTHORIZATION' => credentials
  end
end

class AcceptBuildDataTest < ActionDispatch::IntegrationTest
  include IntegrationTestHelper

  class ChannelMock; def trigger(*); end; end

  attr_reader :channel, :build

  def setup
    super
    flush_redis
    @build = Build.create!
    @channel = ChannelMock.new
    Pusher.stubs(:[]).returns(channel)
  end

  test 'POST to /builds (ping from github) creates a build record' do
    assert_difference('Build.count', 1) do
      post_from_github!
    end
  end

  test 'POST to /builds (ping from github) creates a build job' do
    assert_difference('Resque.size(:builds)', 1) do
      post_from_github!
    end
  end

  test 'POST to /builds: the build job includes the relevant information to a) build the repository and b) update the browser via websocket' do
    post_from_github!
    job = Resque.reserve(:builds)
    actual = job.args.last

    actual['id'] = 1 # argh ...
    actual['repository']['id'] = 1

    assert_equal RESQUE_PAYLOADS['gem-release'], actual
  end

  test "POST to /builds: sets the job's meta_id to the build record" do
    post_from_github!
    job = Resque.reserve(:builds)
    assert_equal job.args.first, Build.last.job_id
  end

  test "POST to /builds: sends a build:queued event to Pusher" do
    channel.expects(:trigger) # TODO uh, this doesn't seem to test anything
    post_from_github!
  end

  test 'PUT to /builds/:id configures the build and expands a given build matrix' do
    config  = { 'script' => 'rake', 'matrix' => [['rvm', '1.8.7', '1.9.2']] }
    payload = { :build => { :config => config, :log => '', :status => nil, :finished_at => nil } }
    authenticated_put(build_path(build), payload)
    build.reload

    assert_equal 'rake', build.config['script']
    assert_equal 2, build.matrix.size
    assert_equal [{ 'rvm' => '1.8.7' }, { 'rvm' => '1.9.2' }], build.matrix.map(&:config)
  end

  test 'PUT to /builds/:id finishes the build' do
    finished_at = Time.now
    config  = { 'script' => 'rake', 'matrix' => [['rvm', '1.8.7', '1.9.2']] }
    payload = { :build => { :config => config, :log => 'the build log', :status => 0, :finished_at => finished_at } }
    authenticated_put(build_path(build), payload)
    build.reload

    assert build.finished?
    assert_equal 'the build log', build.log
    assert_equal 0, build.status
    assert_equal 2, build.matrix.size, "it shouldn't re-expand the existing matrix, but does"
  end
end

