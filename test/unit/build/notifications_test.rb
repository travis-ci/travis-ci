require 'test_helper'

class BuildNotificationsTest < ActiveSupport::TestCase
  attr_reader :repository

  def setup
    @repository = Factory(:repository)
  end

  test 'given the build is a finished non-matrix build: send_notifications? should be true' do
    build = Factory(:build, :repository => repository, :finished_at => Time.now)
    assert build.send_notifications?, 'send_notifications? should be true'
  end

  test 'given the build is a finished matrix child build: send_notifications? should be true' do
    build = Factory(:build, :repository => repository, :finished_at => Time.now)
    child = Factory(:build, :repository => repository, :parent => build)
    assert build.send_notifications?, 'send_notifications? should be true'
  end

  test 'given the build is not finished matrix child build: send_notifications? should be false' do
    build = Factory(:build, :repository => repository, :finished_at => nil)
    child = Factory(:build, :repository => repository, :parent => build)
    assert !build.send_notifications?, 'send_notifications? should be false'
  end

  test 'given the build does not have recipients: send_email_notifications? should be false' do
    build = Factory(:build, :repository => repository, :finished_at => Time.now)
    build.stubs(:unique_recipients).returns('')
    assert !build.send_email_notifications?, 'send_email_notifications? should be false'
  end

  test 'given the build has notifications disabled: send_email_notifications? should be false (deprecated api) (disabled => true)' do
    build = Factory(:build, :repository => repository, :finished_at => Time.now, :config => { 'notifications' => { 'disabled' => true } })
    assert !build.send_email_notifications?, 'send_email_notifications? should be false'
  end

  test 'given the build has notifications disabled: send_email_notifications? should be false (deprecated api) (disable => true)' do
    build = Factory(:build, :repository => repository, :finished_at => Time.now, :config => { 'notifications' => { 'disable' => true } })
    assert !build.send_email_notifications?, 'send_email_notifications? should be false'
  end

  test 'given the build has notifications disabled: send_email_notifications? should be false' do
    build = Factory(:build, :repository => repository, :finished_at => Time.now, :config => { 'notifications' => { 'email' => false } })
    assert !build.send_email_notifications?, 'send_email_notifications? should be false'
  end

  test 'given the build has an author_email: unique_recipients contains these emails' do
    build = Factory(:build, :repository => repository, :author_email => 'author-1@email.com,author-2@email.com')
    assert_contains_recipients(build.unique_recipients, build.author_email)
  end

  test 'given the build has an committer_email: unique_recipients contains these emails' do
    build = Factory(:build, :repository => repository, :committer_email => 'committer-1@email.com,committer-2@email.com')
    assert_contains_recipients(build.unique_recipients, build.committer_email)
  end

  test "given the build's repository has an owner_email: unique_recipients contains these emails" do
    build = Factory(:build, :repository => repository)
    build.repository.stubs(:owner_email).returns('owner-1@email.com,owner-2@email.com')
    assert_contains_recipients(build.unique_recipients, build.repository.owner_email)
  end

  test "given the build's configuration has recipients specified: unique_recipients contains these emails" do
    recipients = %w(recipient-1@email.com recipient-2@email.com)
    build = Factory(:build, :repository => repository, :config => { 'notifications' => { 'recipients' => recipients } })
    assert_contains_recipients(build.unique_recipients, recipients)
  end

  test "given the builds configuration exists but has no email details, unique_recipients contains the owner details" do
    build = Factory(:build, :repository => repository, :config => {})
    build.repository.stubs(:owner_email).returns('owner-1@email.com,owner-2@email.com')
    assert_contains_recipients(build.unique_recipients, build.repository.owner_email)
  end

  protected

    def assert_contains_recipients(actual, expected)
      actual = actual.split(',')
      expected = expected.split(',')
      assert_equal (actual & expected).size, expected.size, "#{actual.join(',')} to contain #{expected.join(',')}"
    end
end
