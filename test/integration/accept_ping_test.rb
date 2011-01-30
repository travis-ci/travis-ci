require 'test_helper_rails'

class AcceptPingTest < ActionDispatch::IntegrationTest
  class ChannelMock; def trigger(*); end; end

  attr_reader :channel, :user

  def setup
    super
    @user = User.create!(:login => 'svenfuchs')
    user.tokens.create!

    @channel = ChannelMock.new
    Pusher.stubs(:[]).returns(channel)
    Resque.redis.flushall
  end

  def ping!
    credentials = ActionController::HttpAuthentication::Basic.encode_credentials(user.login, user.tokens.first.token)
    post '/builds', { :payload => GITHUB_PAYLOADS['gem-release'] }, 'HTTP_AUTHORIZATION' => credentials
  end

  test 'a ping from github creates a build record (not sure it really should or instead the worker should do this?)' do
    assert_difference('Build.count', 1) do
      ping!
    end
  end

  test 'a ping from github creates a build job' do
    assert_difference('Resque.size(:builds)', 1) do
      ping!
    end
  end

  test 'a build job includes the relevant information to a) build the repository and b) update the browser via websocket' do
    ping!
    job = Resque.reserve(:builds)
    actual = job.args.last

    actual['id'] = 1 # argh ...
    actual['repository']['id'] = 1

    assert_equal RESQUE_PAYLOADS['gem-release'], actual
  end

  test "sets the job's meta_id to the build record" do
    ping!
    job = Resque.reserve(:builds)
    assert_equal job.args.first, Build.last.job_id
  end

  test "sends a build:queued event to Pusher" do
    channel.expects(:trigger) # TODO uh, this doesn't seem to test anything
    ping!
  end
end
