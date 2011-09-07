require 'spec_helper'

describe Build, 'notifications', ActiveSupport::TestCase do
  describe :send_notifications_for? do
    it 'returns true by default' do
      build = Factory(:build)
      build.send_email_notifications?.should be_true
    end

    it 'returns false if the build does not have any recipients' do
      build = Factory(:build, :state => :finished)
      build.stubs(:email_recipients).returns('')
      build.send_email_notifications?.should be_false
    end

    it 'returns false if the build has notifications disabled (deprecated api) (disabled => true)' do
      build = Factory(:build, :state => :finished, :config => { :notifications => { :disabled => true } })
      build.send_email_notifications?.should be_false
    end

    it 'returns false if the build has notifications disabled (deprecated api) (disable => true)' do
      build = Factory(:build, :state => :finished, :config => { :notifications => { :disable => true } })
      build.send_email_notifications?.should be_false
    end

    it 'returns false if the build has notifications disabled' do
      build = Factory(:build, :state => :finished, :config => { :notifications => { :email => false } })
      build.send_email_notifications?.should be_false
    end

    [%w(successful broken), %w(broken successful)].each do |previous, current|
      it "returns true if build status is #{current} and previous build status is #{previous}" do
        previous_build = Factory("#{previous}_build".to_sym)
        build = Factory("#{current}_build".to_sym, :repository => previous_build.repository)
        build.send_email_notifications?.should be_true
      end
    end

    context 'notification verbosity configuration' do
      [[%w(broken broken),     {:on_failure => :always}, true],
       [%w(successful broken), {:on_failure => :always}, true],
       [%w(broken broken),     {:on_failure => :change}, false],
       [%w(successful broken), {:on_failure => :change}, true],
       [%w(successful broken), {:on_failure => :never},  false],
       [%w(successful successful), {:on_success => :always}, true],
       [%w(broken successful),     {:on_success => :always}, true],
       [%w(successful successful), {:on_success => :change}, false],
       [%w(broken successful),     {:on_success => :change}, true],
       [%w(broken successful),     {:on_success => :never},  false],
      ].each do |states, config, outcome|
        it "returns #{outcome} if previous build was #{states[0]}, current build is #{states[1]}, and config is #{config}" do
          previous_build = Factory("#{states[0]}_build".to_sym)
          build = Factory("#{states[1]}_build".to_sym, :repository => previous_build.repository,
                          :config => { :notifications => config})
          build.send_email_notifications?.should == outcome
        end
      end
    end
  end

  describe :email_recipients do
    it 'contains the author emails if the build has them set' do
      build = Factory(:build, :commit => Factory(:commit, :author_email => 'author-1@email.com,author-2@email.com'))
      assert_contains_recipients(build.email_recipients, build.commit.author_email)
    end

    it 'contains the committer emails if the build has them set' do
      build = Factory(:build, :commit => Factory(:commit, :committer_email => 'committer-1@email.com,committer-2@email.com'))
      assert_contains_recipients(build.email_recipients, build.commit.committer_email)
    end

    it "contains the build's repository owner_email if it has one" do
      build = Factory(:build)
      build.repository.stubs(:owner_email).returns('owner-1@email.com,owner-2@email.com')
      assert_contains_recipients(build.email_recipients, build.repository.owner_email)
    end

    it 'contains the owner details if it has a configuration but no emails specified' do
      build = Factory(:build, :config => {})
      build.repository.stubs(:owner_email).returns('owner-1@email.com,owner-2@email.com')
      assert_contains_recipients(build.email_recipients, build.repository.owner_email)
    end

    it "equals the recipients specified in the build configuration if any" do
      recipients = %w(recipient-1@email.com recipient-2@email.com)
      build = Factory(:build, :config => { :notifications => { :recipients => recipients } })
      assert_contains_recipients(build.email_recipients, recipients)
    end
  end

  describe :send_webhook_notifications? do
    it 'returns true if the build configuration specifies webhooks' do
      build = Factory(:build, :config => { :notifications => { :webhooks => ['http://evome.fr/notifications', 'http://example.com/'] } })
      build.send_webhook_notifications?.should be_true
    end

    it 'returns false if the build configuration does not specify any webhooks' do
      build = Factory(:build)
      build.send_webhook_notifications?.should be_false
    end
  end

  describe :webhooks do
    it 'returns an array of values if the build configuration specifies a single, comma separated string' do
      webhooks = 'http://evome.fr/notifications, http://example.com'
      build = Factory(:build, :config => { :notifications => { :webhooks => webhooks } })
      build.webhooks.should == webhooks.split(' ').map(&:strip)
    end

    it 'returns an array of values if the build configuration specifies an array of values' do
      webhooks = %w(http://evome.fr/notifications http://example.com)
      build = Factory(:build, :config => { :notifications => { :webhooks => webhooks } })
      build.webhooks.should == webhooks
    end

    it 'returns an array of values if the build configuration specifies the array of values within a config hash' do
      webhooks = %w(http://evome.fr/notifications http://example.com)
      build = Factory(:build, :config => { :notifications => { :webhooks => {:urls => webhooks, :on_success => :change} } })
      build.webhooks.should == webhooks
    end
  end

  describe :irc_channels do
    it 'groups irc channels by host & port, so notifications can be sent with one connection' do
      build = Factory(:build, :config => { 'notifications' =>
                                             { 'irc' =>
                                                ["irc.freenode.net:1234#travis",
                                                 "irc.freenode.net#rails",
                                                 "irc.freenode.net:1234#travis-2",
                                                 "irc.example.com#travis-3"]}})
      build.irc_channels.should == {["irc.freenode.net", '1234'] => ['travis', 'travis-2'],
                                    ["irc.freenode.net", nil]    => ['rails'],
                                    ["irc.example.com",  nil]    => ['travis-3']}
    end
  end

  protected

    # TODO convert to an rspec matcher?
    def assert_contains_recipients(actual, expected)
      actual = actual.split(',')
      expected = expected.split(',')
      assert_equal (actual & expected).size, expected.size, "#{actual.join(',')} to contain #{expected.join(',')}"
    end
end

