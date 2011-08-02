require 'test_helper'

class RequestSourcesGithubTest < ActiveSupport::TestCase
  include TestHelpers::GithubApiTestHelper

  test 'creating a Request from Github payload' do
    request = Request.create_from_github_payload(GITHUB_PAYLOADS['gem-release'], 'abc').reload
    repository = request.repository
    commit = request.commit

    assert_equal GITHUB_PAYLOADS['gem-release'], request.payload

    assert_equal '9854592', commit.commit
    assert_equal 'Bump to 0.0.15', commit.message
    assert_equal 'master', commit.branch
    assert_equal '2010-10-27 04:32:37 UTC', commit.committed_at.to_formatted_s

    assert_equal 'Sven Fuchs', commit.committer_name
    assert_equal 'svenfuchs@artweb-design.de', commit.committer_email
    assert_equal 'Christopher Floess', commit.author_name
    assert_equal 'chris@flooose.de', commit.author_email

    assert_equal 'gem-release', repository.name
    assert_equal 'svenfuchs', repository.owner_name
    assert_equal 'svenfuchs@artweb-design.de', repository.owner_email
    assert_equal 'svenfuchs', repository.owner_name
    assert_equal 'http://github.com/svenfuchs/gem-release', repository.url
    # assert_equal 'abc', request.token
  end

  test 'a Github payload for a gh_pages branch does not create a request' do
    assert_difference('Request.count', 0) do
      Request.create_from_github_payload(GITHUB_PAYLOADS['gh-pages-update'], 'abc')
    end
  end

  test 'a Github payload for a private repo does not create a request' do
    assert_difference('Request.count', 0) do
      Request.create_from_github_payload(GITHUB_PAYLOADS['private-repo'], 'abc')
    end
  end

  test 'a Github payload for a private repo returns falseish' do
    assert !Request.create_from_github_payload(GITHUB_PAYLOADS['private-repo'], 'abc')
  end

  test 'a Github payload containing no commit information does not create a request' do
    assert_difference('Request.count', 0) do
      Request.create_from_github_payload(GITHUB_PAYLOADS['force-no-commit'], 'abc')
    end
  end
end
