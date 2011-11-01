require 'spec_helper'

describe Build::Notifications do
  include Build::Notifications

  let(:config)     { }
  let(:commit)     { stub('commit', :committer_email => 'commiter@email.org', :author_email => 'author@email.org') }
  let(:repository) { stub('repository', :owner_email => 'owner@email.org') }

  before(:each) do
    stubs(:previous_on_branch)
  end

  describe :send_notifications_for? do
    it 'returns true by default' do
      send_email_notifications?.should be_true
    end

    it 'returns false if the build does not have any recipients' do
      stubs(:email_recipients).returns('')
      send_email_notifications?.should be_false
    end

    it 'returns false if the build has notifications disabled (deprecated api) (disabled => true)' do
      stubs(:config => { :notifications => { :disabled => true } })
      send_email_notifications?.should be_false
    end

    it 'returns false if the build has notifications disabled (deprecated api) (disable => true)' do
      stubs(:config => { :notifications => { :disable => true } })
      send_email_notifications?.should be_false
    end

    it 'returns false if the build has notifications disabled' do
      stubs(:config => { :notifications => { :email => false } })
      send_email_notifications?.should be_false
    end

    it "returns true if the given build failed and previous build failed" do
      stubs(:passed? => false, :failed? => true, :previous_on_branch => stub('previous', :passed? => false))
      send_email_notifications?.should be_true
    end

    it "returns true if the given build failed and previous build passed" do
      stubs(:passed? => false, :failed? => true, :previous_on_branch => stub('previous', :passed? => true))
      send_email_notifications?.should be_true
    end

    it "returns true if the given build passed and previous build failed" do
      stubs(:passed? => true, :failed? => false, :previous_on_branch => stub('previous', :passed? => false))
      send_email_notifications?.should be_true
    end

    it "returns false if the given build passed and previous build passed" do
      stubs(:passed? => true, :failed? => false, :previous_on_branch => stub('previous', :passed? => true))
      send_email_notifications?.should be_false
    end

    combinations = [
      [false, false, { :notifications => { :on_failure => 'always' } }, true ],
      [true,  false, { :notifications => { :on_failure => 'always' } }, true ],
      [false, false, { :notifications => { :on_failure => 'change' } }, false],
      [true,  false, { :notifications => { :on_failure => 'change' } }, true ],
      [true,  false, { :notifications => { :on_failure => 'never'  } }, false],
      [true,  true,  { :notifications => { :on_success => 'always' } }, true ],
      [false, true,  { :notifications => { :on_success => 'always' } }, true ],
      [true,  true,  { :notifications => { :on_success => 'change' } }, false],
      [false, true,  { :notifications => { :on_success => 'change' } }, true ],
      [false, true,  { :notifications => { :on_success => 'never'  } }, false],
    ]
    status = { true  => 'passed', false => 'failed' }

    combinations.each do |previous, current, config, result|
      it "returns #{result} if the previous build #{status[previous]}, the current build #{status[current]} and config is #{config}" do
        stubs(:config => config, :passed? => current, :failed? => !current, :previous_on_branch => stub('previous', :passed? => previous))
        send_email_notifications?.should == result
      end
    end
  end

  describe :email_recipients do
    it 'contains the author emails if the build has them set' do
      commit.stub(:author_email => 'author-1@email.com,author-2@email.com')
      email_recipients.should contain_recipients(commit.author_email)
    end

    it 'contains the committer emails if the build has them set' do
      commit.stub(:committer_email => 'committer-1@email.com,committer-2@email.com')
      email_recipients.should contain_recipients(commit.committer_email)
    end

    it "contains the build's repository owner_email if it has one" do
      repository.stub(:owner_email => 'owner-1@email.com,owner-2@email.com')
      email_recipients.should contain_recipients(commit.committer_email)
    end

    it "contains the build's repository owner_email if it has a configuration but no emails specified" do
      stubs(:config => {})
      repository.stub(:owner_email => 'owner-1@email.com')
      email_recipients.should contain_recipients(repository.owner_email)
    end

    it "equals the recipients specified in the build configuration if any (given as an array)" do
      recipients = %w(recipient-1@email.com recipient-2@email.com)
      stubs(:config => { :notifications => { :recipients => recipients } })
      email_recipients.should contain_recipients(recipients)
    end

    it "equals the recipients specified in the build configuration if any (given as a string)" do
      recipients = 'recipient-1@email.com,recipient-2@email.com'
      stubs(:config => { :notifications => { :recipients => recipients } })
      email_recipients.should contain_recipients(recipients)
    end
  end

  describe :send_webhook_notifications? do
    it 'returns true if the build configuration specifies webhooks' do
      webhooks = %w(http://evome.fr/notifications http://example.com/)
      stubs(:config => { :notifications => { :webhooks => webhooks } })
      send_webhook_notifications?.should be_true
    end

    it 'returns false if the build configuration does not specify any webhooks' do
      webhooks = %w(http://evome.fr/notifications http://example.com/)
      stubs(:config => {})
      send_webhook_notifications?.should be_false
    end
  end

  describe :webhooks do
    it 'returns an array of urls when given a string' do
      webhooks = 'http://evome.fr/notifications'
      stubs(:config => { :notifications => { :webhooks => webhooks } })
      self.webhooks.should == [webhooks]
    end

    it 'returns an array of urls when given an array' do
      webhooks = ['http://evome.fr/notifications']
      stubs(:config => { :notifications => { :webhooks => webhooks } })
      self.webhooks.should == webhooks
    end

    it 'returns an array of multiple urls when given a comma separated string' do
      webhooks = 'http://evome.fr/notifications, http://example.com'
      stubs(:config => { :notifications => { :webhooks => webhooks } })
      self.webhooks.should == webhooks.split(' ').map(&:strip)
    end

    it 'returns an array of urls if the build configuration specifies an array of urls' do
      webhooks = %w(http://evome.fr/notifications http://example.com)
      stubs(:config => { :notifications => { :webhooks => webhooks } })
      self.webhooks.should == webhooks
    end

    it 'returns an array of values if the build configuration specifies an array of urls within a config hash' do
      webhooks = { :urls => %w(http://evome.fr/notifications http://example.com), :on_success => 'change' }
      stubs(:config => { :notifications => { :webhooks => webhooks } })
      self.webhooks.should == webhooks[:urls]
    end
  end

  describe :irc_channels do
    it 'groups irc channels by host & port, so notifications can be sent with one connection' do
      stubs(:config => { :notifications => { :irc => %w(
        irc.freenode.net:1234#travis
        irc.freenode.net#rails
        irc.freenode.net:1234#travis-2
        irc.example.com#travis-3
      )}})
      irc_channels.should == {
        ["irc.freenode.net", '1234'] => ['travis', 'travis-2'],
        ["irc.freenode.net", nil]    => ['rails'],
        ["irc.example.com",  nil]    => ['travis-3']
      }
    end
  end
end
