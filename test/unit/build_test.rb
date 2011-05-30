require 'test_helper_rails'

class BuildTest < ActiveSupport::TestCase
  include GithubApiTestHelper

  test 'creating a Build from Github payload' do
    Repository.delete_all
    Build.delete_all

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

  test 'creating a Build from Github payload from a gh_pages branch' do
    Repository.delete_all
    Build.delete_all

    assert_nil Build.create_from_github_payload(GITHUB_PAYLOADS['gh-pages-update'])
  end

  test 'next_number (1)' do
    repository = Factory(:repository)
    assert_equal 1, repository.builds.next_number
  end

  test 'next_number (2)' do
    repository = Factory(:repository)
    3.times { |number| Factory(:build, :repository => repository, :number => number + 1) }
    assert_equal 4, repository.builds.next_number
  end

  test 'next_number (3)' do
    repository = Factory(:repository)
    Factory(:build, :repository => repository, :number => '3.1')
    assert_equal 4, repository.builds.next_number
  end

  test 'send_notifications? for !parent should return true' do
    build = Factory(:build)
    build.stubs(:parent).returns(false)
    assert build.send_notifications?, 'should return true if !parent'
  end

  test 'send_notifications? for build.patent.finished? should return true' do
    build = Factory(:build)
    build.parent.stubs(:finished).returns(true)
    assert build.send_notifications?, 'should return true if parent.finished?'
  end

  test 'send_notifications? for parent and !parent.finished? should return true' do
    parent_object = Object.new
    parent_object.stubs('finished?').returns(false)
    build = Factory(:build)
    build.stubs(:parent).returns(parent_object)

    assert !build.send_notifications?, 'should return false if parent'
  end

  test 'send_notifications? for config["notifications"]["disable"]' do
    build = Factory(:build)
    build.config = {'notifications' => {'disabled' => true}}

    assert !build.send_notifications?, 'should return false if disabled'
  end
end
