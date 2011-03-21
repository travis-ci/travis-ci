require 'test_helper_rails'

class BuildTest < ActiveSupport::TestCase
  test 'building a Build from Github payload' do
    Repository.delete_all

    build = Build.create_from_github_payload(JSON.parse(GITHUB_PAYLOADS['gem-release']))

    assert_equal '9854592', build.commit
    assert_equal 'Bump to 0.0.15', build.message
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
  end
end
