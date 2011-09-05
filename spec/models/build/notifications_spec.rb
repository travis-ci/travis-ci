require 'spec_helper'

describe Build, 'notifications', ActiveSupport::TestCase do
  describe :send_email_notifications? do
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

    it 'returns true if this build passed and there are no previous builds' do
      build = Factory(:successful_build)
      build.send_email_notifications?.should be_true
    end

    it 'returns true if this build passed and the previous build failed' do
      broken = Factory(:broken_build)
      build = Factory(:successful_build, :repository => broken.repository)
      build.send_email_notifications?.should be_true
    end

    it 'returns false if both this build and the previous build passed' do
      successful = Factory(:successful_build)
      build = Factory(:successful_build, :repository => successful.repository)
      build.send_email_notifications?.should be_false
    end

    context 'verbose notifications' do
      it 'returns true if both this build and the previous build passed' do
        successful = Factory(:successful_build)
        build = Factory(:successful_build, :repository => successful.repository,
                        :config => { 'notifications' => { 'verbose' => true }})
        build.send_email_notifications?.should be_true
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
  end

  protected

    # TODO convert to an rspec matcher?
    def assert_contains_recipients(actual, expected)
      actual = actual.split(',')
      expected = expected.split(',')
      assert_equal (actual & expected).size, expected.size, "#{actual.join(',')} to contain #{expected.join(',')}"
    end
end

