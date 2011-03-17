require 'test_helper_rails'

class BuildTest < ActiveSupport::TestCase
  test 'building a Build from Github payload' do
    build = Build.create_from_github_payload(JSON.parse(GITHUB_PAYLOADS['gem-release']))

    assert_equal '9854592', build.commit
    assert_equal 'Bump to 0.0.15', build.message
    assert_equal '2010-10-27 04:32:37 UTC', build.committed_at.to_formatted_s
    assert_equal 'Sven Fuchs', build.committer_name
    assert_equal 'svenfuchs@artweb-design.de', build.committer_email
    assert_equal 'Christopher Floess', build.author_name
    assert_equal 'chris@flooose.de', build.author_email

    assert_equal 'svenfuchs/gem-release', build.repository.name
    assert_equal 'http://github.com/svenfuchs/gem-release', build.repository.url
  end

  test 'as_json includes everything required for the build details view, the build:started event and the resque build job' do
    build = FactoryGirl.create(:build)
    expected = {
      'id' => build.id,
      'repository_id' => build.repository.id,
      'number' => nil,
      'log' => '',
      'status' => nil,
      'started_at' => nil,
      'finished_at' => nil,
      'commit' => '62aae5f70ceee39123ef',
      'message' => nil,
      'committed_at' => nil,
      'committer_name' => nil,
      'committer_email' => nil,
      'author_name' => nil,
      'author_email' => nil,
    }
    assert_equal_hashes expected, build.as_json
  end

  test 'as_json(:for => :event) includes everything required for the build:started event (and the resque build job)' do
    build = FactoryGirl.create(:build)
    expected = {
      'id' => build.id,
      'repository_id' => build.repository.id,
      'number' => nil,
      'log' => '',
      'status' => nil,
      'started_at' => nil,
      'finished_at' => nil,
      'commit' => '62aae5f70ceee39123ef',
      'message' => nil,
      'committed_at' => nil,
      'committer_name' => nil,
      'committer_email' => nil,
      'author_name' => nil,
      'author_email' => nil,
      :repository => {
        'id' => build.repository.id,
        'name' => build.repository.name
      }
    }
    assert_equal_hashes expected, build.as_json(:for => :event)
  end
end
