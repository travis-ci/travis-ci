require 'test_helper'

class BuildTest < ActiveSupport::TestCase
  include TestHelpers::GithubApiTestHelper

  def setup
    @repository = Factory(:repository)
  end
  # Build.send(:public, :denormalize_to_repository?, :denormalize_to_repository)

  test 'creating a Build from Github payload' do
    build = Build.create_from_github_payload(GITHUB_PAYLOADS['gem-release']).reload

    assert_equal '1', build.number
    assert_equal '9854592', build.commit
    assert_equal 'Bump to 0.0.15', build.message
    assert_equal 'master', build.branch
    assert_equal '2010-10-27 04:32:37 UTC', build.committed_at.to_formatted_s

    assert_equal 'Sven Fuchs', build.committer_name
    assert_equal 'svenfuchs@artweb-design.de', build.committer_email
    assert_equal 'Christopher Floess', build.author_name
    assert_equal 'chris@flooose.de', build.author_email

    assert_equal 'gem-release', build.repository.name
    assert_equal 'svenfuchs', build.repository.owner_name
    assert_equal 'svenfuchs@artweb-design.de', build.repository.owner_email
    assert_equal 'svenfuchs', build.repository.owner_name
    assert_equal 'http://github.com/svenfuchs/gem-release', build.repository.url

    assert_equal GITHUB_PAYLOADS['gem-release'], build.github_payload
  end

  test 'a Github payload for a gh_pages branch does not create a build' do
    assert_difference('Build.count', 0) do
      Build.create_from_github_payload(GITHUB_PAYLOADS['gh-pages-update'])
    end
  end

  test 'a Github payload for a private repo does not create a build' do
    assert_difference('Build.count', 0) do
      Build.create_from_github_payload(GITHUB_PAYLOADS['private-repo'])
    end
  end

  test 'a Github payload for a private repo returns falsea' do
    assert_equal Build.create_from_github_payload(GITHUB_PAYLOADS['private-repo']) , false
  end

  test 'a Github payload containing no commit information does not create a build' do
    assert_difference('Build.count', 0) do
      Build.create_from_github_payload(GITHUB_PAYLOADS['force-no-commit'])
    end
  end

  test 'next_number (1)' do
    assert_equal 1, @repository.builds.next_number
  end

  test 'next_number (2)' do
    3.times { |number| Factory(:build, :repository => @repository, :number => number + 1) }
    assert_equal 4, @repository.builds.next_number
  end

  test 'next_number (3)' do
    Factory(:build, :repository => @repository, :number => '3.1')
    assert_equal 4, @repository.builds.next_number
  end

  test 'given the build is a finished non-matrix build w/ recipients: send_notifications? should be true' do
    build = Factory(:build, :repository => @repository, :finished_at => Time.now)
    assert build.send_notifications?, 'send_notifications? should be true'
  end

  test 'given the build is a finished matrix child build w/ recipients: send_notifications? should be true' do
    build = Factory(:build, :repository => @repository, :finished_at => Time.now)
    child = Factory(:build, :repository => @repository, :parent => build)
    assert build.send_notifications?, 'send_notifications? should be true'
  end

  test 'given the build is not finished matrix child build: send_notifications? should be false' do
    build = Factory(:build, :repository => @repository, :finished_at => nil)
    child = Factory(:build, :repository => @repository, :parent => build)
    assert !build.send_notifications?, 'send_notifications? should be false'
  end

  test 'given the build does not have recipients: send_notifications? should be false' do
    build = Factory(:build, :repository => @repository, :finished_at => Time.now)
    build.stubs(:unique_recipients).returns('')
    assert !build.send_notifications?, 'send_notifications? should be false'
  end

  test 'given the build has notifications disabled: send_notifications? should be false' do
    build = Factory(:build, :repository => @repository, :finished_at => Time.now, :config => { 'notifications' => { 'disabled' => true } })
    assert !build.send_notifications?, 'send_notifications? should be false'
  end

  test 'given the build has an author_email: unique_recipients contains these emails' do
    build = Factory(:build, :repository => @repository, :author_email => 'author-1@email.com,author-2@email.com')
    assert_contains_recipients(build.unique_recipients, build.author_email)
  end

  test 'given the build has an committer_email: unique_recipients contains these emails' do
    build = Factory(:build, :repository => @repository, :committer_email => 'committer-1@email.com,committer-2@email.com')
    assert_contains_recipients(build.unique_recipients, build.committer_email)
  end

  test "given the build's repository has an owner_email: unique_recipients contains these emails" do
    build = Factory(:build, :repository => @repository)
    build.repository.stubs(:owner_email).returns('owner-1@email.com,owner-2@email.com')
    assert_contains_recipients(build.unique_recipients, build.repository.owner_email)
  end

  test "given the build's configuration has recipients specified: unique_recipients contains these emails" do
    recipients = %w(recipient-1@email.com recipient-2@email.com)
    build = Factory(:build, :repository => @repository, :config => { 'notifications' => { 'recipients' => recipients } })
    assert_contains_recipients(build.unique_recipients, recipients)
  end

  test "denormalize_to_repository denormalizes the build id, number and started_at attributes to the build's repository" do
    build = Factory(:build, :repository => @repository)
    now = Time.current
    build.update_attributes!(:number => 1, :started_at => now)
    repository = build.repository.reload

    assert_equal build.id, repository.last_build_id
    assert_equal build.number.to_s, repository.last_build_number
    assert_equal now.to_s, repository.last_build_started_at.to_s
  end

  test "denormalize_to_repository denormalizes the build status and finished_at attributes to the build's repository if this is not a matrix build" do
    build = Factory(:build, :repository => @repository)
    now = Time.current
    build.update_attributes!(:finished_at => now, :status => 0)
    repository = build.repository.reload

    assert_equal 0, repository.last_build_status
    assert_equal now.to_s, repository.last_build_finished_at.to_s
  end

  test "denormalize_to_repository denormalizes the build status and finished_at attributes to the build's repository if this is a matrix build and all children have finished" do
    build = Factory(:build, :repository => @repository, :matrix => [Factory(:build, :repository => @repository), Factory(:build, :repository => @repository)], :config => { 'rvm' => ['1.8.7', '1.9.2'] })
    now = Time.current
    build.matrix.first.update_attributes!(:finished_at => now, :status => 0)
    build.matrix.last.update_attributes!(:finished_at => now, :status => 0)
    repository = build.repository.reload

    assert_equal 0, repository.last_build_status
    assert_equal now.to_s, repository.last_build_finished_at.to_s
  end

  protected

    def assert_contains_recipients(actual, expected)
      actual = actual.split(',')
      expected = expected.split(',')
      assert_equal (actual & expected).size, expected.size, "#{actual.join(',')} to contain #{expected.join(',')}"
    end
end
