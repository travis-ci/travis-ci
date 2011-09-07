require 'spec_helper'

describe Travis::Notifications::Irc do
  attr_reader :irc

  before do
    @irc = Support::Mocks::Irc.new
    TCPSocket.any_instance.stubs(:puts => true, :get => true, :eof? => true)
    Travis.config.notifications = [:irc]
  end

  after do
    Travis.config.notifications.clear
    Travis::Notifications.subscriptions.clear
  end

  let(:repository) { Factory(:repository, :owner_email => 'owner@example.com') }

  def expect_irc(host, options = {})
    IrcClient.expects(:new).once.with(host, 'travis-ci', { :port => nil }.merge(options)).returns(irc)
  end

  it "no irc notifications" do
    build = Factory(:build)
    IrcClient.expects(:new).never
    Travis::Notifications.dispatch('build:finished', build)
  end

  it "one irc notification" do
    build = Factory(:build, :config => { 'notifications' => { 'irc' => "irc.freenode.net:1234#travis" } })

    expect_irc('irc.freenode.net', { :port => '1234' })

    Travis::Notifications::Irc.new.notify('build:finished', build)

    expected = [
      'JOIN #travis',
      '[travis-ci] svenfuchs/minimal#1 (master - 62aae5f : Sven Fuchs): the build has failed',
      '[travis-ci] Change view : https://github.com/svenfuchs/minimal/compare/master...develop',
      "[travis-ci] Build details : http://test.travis-ci.org/svenfuchs/minimal/builds/#{build.id}",
    ]

    expected.size.times { |ix|
      irc.output[ix].should == expected[ix]
    }
  end

  it "two irc notifications, using config with notification rules" do
    build = Factory(:build, :config => {
                              'notifications' => {
                                'irc' => {
                                  'on_success' => "always",
                                  'channels' =>
                                      ["irc.freenode.net:1234#travis", "irc.freenode.net#rails"]}}})

    expect_irc('irc.freenode.net', { :port => '1234' })
    expect_irc('irc.freenode.net')

    Travis::Notifications::Irc.new.notify('build:finished', build)

    expected = [
      'JOIN #travis',
      '[travis-ci] svenfuchs/minimal#1 (master - 62aae5f : Sven Fuchs): the build has failed',
      '[travis-ci] Change view : https://github.com/svenfuchs/minimal/compare/master...develop',
      "[travis-ci] Build details : http://test.travis-ci.org/svenfuchs/minimal/builds/#{build.id}",
      "PART #travis",
      "QUIT",
      'JOIN #rails',
      '[travis-ci] svenfuchs/minimal#1 (master - 62aae5f : Sven Fuchs): the build has failed',
      '[travis-ci] Change view : https://github.com/svenfuchs/minimal/compare/master...develop',
      "[travis-ci] Build details : http://test.travis-ci.org/svenfuchs/minimal/builds/#{build.id}",
    ]

    expected.size.times { |ix|
      irc.output[ix].should == expected[ix]
    }
  end
end

