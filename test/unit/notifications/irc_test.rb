require 'unit/notifications/notifications_test_case'

class IrcNotificationsTest < NotificationsTestCase
  def setup
    @repository = Factory(:repository, :owner_email => 'foo@example.com')
    TCPSocket.any_instance.stubs(:puts => true, :get => true, :eof? => true)
  end

  before do
    super
    @irc_mock = IrcMock.new
  end

  def stub_simple_irc(server, options)
    Travis::Notifications::Irc::SimpleIrc.
      expects(:new).once.
      with(server, 'Travis-CI-bot', options).returns(@irc_mock)
  end

  ###########################################

  it "no irc notifications" do
    Travis::Notifications::Irc::SimpleIrc.expects(:new).never

    Travis::Notifications::Irc.notify(create_build)
  end

  it "one irc notification" do
    build = create_build({ 'notifications' => { 'irc' => "irc.freenode.org:1234#fbb" } })

    stub_simple_irc('irc.freenode.org', { :port => 1234 })

    Travis::Notifications::Irc.notify(build)

    assert_match /JOIN #fbb/, @irc_mock.output[0]
    assert_match /\[Travis-CI\] svenfuchs\/minimal#1 \(master - 62aae5f : Foo Bar\): the build has failed/, @irc_mock.output[1]
    assert_match /\[Travis-CI\] Change view : https:\/\/github.com\/foo\/bar-baz\/compare\/master\.\.\.develop/, @irc_mock.output[2]
    assert_match /\[Travis-CI\] Build details : http:\/\/test.travis-ci.org\/svenfuchs\/minimal\/builds\/1/, @irc_mock.output[3]
  end

  it "two irc notifications" do
    build = create_build({ 'notifications' => { 'irc' => ["irc.freenode.org:1234#foo", "irc.freenode.org#bar"] } })

    stub_simple_irc('irc.freenode.org', { :port => 1234 })
    stub_simple_irc('irc.freenode.org', {})

    Travis::Notifications::Irc.notify(build)

    assert_match /JOIN #foo/, @irc_mock.output[0]
    assert_match /\[Travis-CI\] svenfuchs\/minimal#1 \(master - 62aae5f : Foo Bar\): the build has failed/, @irc_mock.output[1]
    assert_match /\[Travis-CI\] Change view : https:\/\/github.com\/foo\/bar-baz\/compare\/master\.\.\.develop/, @irc_mock.output[2]
    assert_match /\[Travis-CI\] Build details : http:\/\/test.travis-ci.org\/svenfuchs\/minimal\/builds\/1/, @irc_mock.output[3]

    assert_match /JOIN #bar/, @irc_mock.output[6]
    assert_match /\[Travis-CI\] svenfuchs\/minimal#1 \(master - 62aae5f : Foo Bar\): the build has failed/, @irc_mock.output[7]
    assert_match /\[Travis-CI\] Change view : https:\/\/github.com\/foo\/bar-baz\/compare\/master\.\.\.develop/, @irc_mock.output[8]
    assert_match /\[Travis-CI\] Build details : http:\/\/test.travis-ci.org\/svenfuchs\/minimal\/builds\/1/, @irc_mock.output[9]
  end

  it "irc notification sent via travis notifications" do
    build = create_build({ 'notifications' => { 'irc' => "irc.freenode.org#foobarbaz" } })

    stub_simple_irc('irc.freenode.org', {})

    Travis::Notifications.send_notifications(build)

    assert_match /JOIN #foobarbaz/, @irc_mock.output[0]
  end
end
