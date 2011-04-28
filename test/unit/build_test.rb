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

  test 'creating a second Build from a GitHub payload before the first finished' do
    Repository.delete_all
    Build.delete_all

    Build.create_from_github_payload(GITHUB_PAYLOADS['gem-release']).save
    build = Build.create_from_github_payload(GITHUB_PAYLOADS['gem-release2'])
    build.last.reload

    assert_equal '9854592', build.first
    assert_equal '1', build.last.number
    assert_equal '9854593', build.last.commit
    assert_equal 'Bump to 0.0.16', build.last.message
    assert_equal '2010-10-27 04:32:47 UTC', build.last.committed_at.to_formatted_s
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
end
