require 'test_helper'

class BuildNotificationsTest < ActiveSupport::TestCase
  test 'given the build is finished send_notifications? should be true' do
    build = Factory(:build, :state => :finished)
    assert build.send_notifications?, 'send_notifications? should be true'
  end

  test 'given the build does not have recipients: send_email_notifications? should be false' do
    build = Factory(:build, :state => :finished)
    build.stubs(:email_recipients).returns('')
    assert !build.send_email_notifications?, 'send_email_notifications? should be false'
  end

  test 'given the build has notifications disabled: send_email_notifications? should be false (deprecated api) (disabled => true)' do
    build = Factory(:build, :state => :finished, :config => { :notifications => { :disabled => true } })
    assert !build.send_email_notifications?, 'send_email_notifications? should be false'
  end

  test 'given the build has notifications disabled: send_email_notifications? should be false (deprecated api) (disable => true)' do
    build = Factory(:build, :state => :finished, :config => { :notifications => { :disable => true } })
    assert !build.send_email_notifications?, 'send_email_notifications? should be false'
  end

  test 'given the build has notifications disabled: send_email_notifications? should be false' do
    build = Factory(:build, :state => :finished, :config => { :notifications => { :email => false } })
    assert !build.send_email_notifications?, 'send_email_notifications? should be false'
  end

  test 'given the build has an author_email: unique_recipients contains these emails' do
    build = Factory(:build, :commit => Factory(:commit, :author_email => 'author-1@email.com,author-2@email.com'))
    assert_contains_recipients(build.email_recipients, build.commit.author_email)
  end

  test 'given the build has an committer_email: unique_recipients contains these emails' do
    build = Factory(:build, :commit => Factory(:commit, :committer_email => 'committer-1@email.com,committer-2@email.com'))
    assert_contains_recipients(build.email_recipients, build.commit.committer_email)
  end

  test "given the build's repository has an owner_email: unique_recipients contains these emails" do
    build = Factory(:build)
    build.repository.stubs(:owner_email).returns('owner-1@email.com,owner-2@email.com')
    assert_contains_recipients(build.email_recipients, build.repository.owner_email)
  end

  test "given the build's configuration has recipients specified: unique_recipients contains these emails" do
    recipients = %w(recipient-1@email.com recipient-2@email.com)
    build = Factory(:build, :config => { :notifications => { :recipients => recipients } })
    assert_contains_recipients(build.email_recipients, recipients)
  end

  protected

    def assert_contains_recipients(actual, expected)
      actual = actual.split(',')
      expected = expected.split(',')
      assert_equal (actual & expected).size, expected.size, "#{actual.join(',')} to contain #{expected.join(',')}"
    end
end
