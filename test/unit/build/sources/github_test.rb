require 'test_helper'

class BuildSourcesGithubTest < ActiveSupport::TestCase
  include TestHelpers::GithubApiTestHelper

  test 'creating a Build from Github payload' do
    build = Build.create_from_github_payload(GITHUB_PAYLOADS['gem-release'], 'abc').reload

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
    assert_equal 'abc', build.token

    assert_equal GITHUB_PAYLOADS['gem-release'], build.github_payload
  end

  test 'a Github payload for a gh_pages branch does not create a build' do
    assert_difference('Build.count', 0) do
      Build.create_from_github_payload(GITHUB_PAYLOADS['gh-pages-update'], 'abc')
    end
  end

  test 'a Github payload for a private repo does not create a build' do
    assert_difference('Build.count', 0) do
      Build.create_from_github_payload(GITHUB_PAYLOADS['private-repo'], 'abc')
    end
  end

  test 'a Github payload for a private repo returns falsea' do
    assert_equal Build.create_from_github_payload(GITHUB_PAYLOADS['private-repo'], 'abc') , false
  end

  test 'a Github payload containing no commit information does not create a build' do
    assert_difference('Build.count', 0) do
      Build.create_from_github_payload(GITHUB_PAYLOADS['force-no-commit'], 'abc')
    end
  end
end
