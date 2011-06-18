require 'test_helper'
require 'github'

class GithubTest < ActiveSupport::TestCase
  include TestHelpers::GithubApiTestHelper

  test 'Github payload repository' do
    data = ActiveSupport::JSON.decode(GITHUB_PAYLOADS['gem-release'])
    payload = Github::ServiceHook::Payload.new(data)

    assert_equal 'gem-release', payload.repository.name
  end

  test 'Github payload builds' do
    data = ActiveSupport::JSON.decode(GITHUB_PAYLOADS['gem-release'])
    payload = Github::ServiceHook::Payload.new(data)
    build = payload.builds.first

    assert_equal '9854592', build.commit
  end

  test 'Github repository owned by a user' do
    repository = Github::Repository.new(:name => 'gem-release', :owner => 'svenfuchs').fetch

    assert_equal 'gem-release', repository.name
    assert_equal 'svenfuchs', repository.owner_name
    assert_equal 'svenfuchs@artweb-design.de', repository.owner_email
  end

  test 'Github repository owned by an organization' do
    repository = Github::Repository.new(:name => 'travis-ci', :owner => 'travis-ci').fetch

    assert_equal 'travis-ci', repository.name
    assert_equal 'travis-ci', repository.owner_name
    assert_equal 'fritz.thielemann@gmail.com,hoverlover@gmail.com,jeff@kreeftmeijer.nl,josh.kalderimis@gmail.com,svenfuchs@artweb-design.de', repository.owner_email
  end

  test 'Github repository to_hash' do
    data = ActiveSupport::JSON.decode(GITHUB_PAYLOADS['gem-release'])
    repository = Github::Repository.new(data['repository'])

    expected = {
      :name        => 'gem-release',
      :url         => 'http://github.com/svenfuchs/gem-release',
      :owner_name  => 'svenfuchs',
      :owner_email => 'svenfuchs@artweb-design.de'
    }
    assert_equal expected, repository.to_hash
  end

  test 'Github build' do
    data = ActiveSupport::JSON.decode(GITHUB_PAYLOADS['gem-release'])
    repository = Github::Repository.new(data['repository'])
    build = Github::Build.new(data['commits'].first.merge(:ref => 'refs/heads/master'), repository, data['compare'])

    assert_equal '9854592', build.commit
    assert_equal 'master', build.branch
    assert_equal 'Bump to 0.0.15', build.message
    assert_equal '2010-10-27 04:32:37', build.committed_at
    assert_equal 'Sven Fuchs', build.committer_name
    assert_equal 'svenfuchs@artweb-design.de', build.committer_email
    assert_equal 'Christopher Floess', build.author_name
    assert_equal 'chris@flooose.de', build.author_email
  end

  test 'Github build to_hash' do
    data = ActiveSupport::JSON.decode(GITHUB_PAYLOADS['gem-release'])
    repository = Github::Repository.new(data['repository'])
    build = Github::Build.new(data['commits'].first.merge(:ref => 'refs/heads/master'), repository, data['compare'])

    expected = {
      :commit => '9854592',
      :branch => 'master',
      :message => 'Bump to 0.0.15',
      :committed_at => '2010-10-27 04:32:37',
      :committer_name => 'Sven Fuchs',
      :committer_email => 'svenfuchs@artweb-design.de',
      :author_name => 'Christopher Floess',
      :author_email => 'chris@flooose.de',
      :compare_url => 'https://github.com/svenfuchs/gem-release/compare/af674bd...9854592'
    }

    assert_equal expected, build.to_hash
  end
end
