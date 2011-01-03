require 'test_helper_rails'

class BuildTest < Test::Unit::TestCase
  test 'building a Build from Github ping data' do
    build = Build.build(JSON.parse(GITHUB_PAYLOADS['gem-release']))

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

  test 'as_json includes everything required for the build:started event' do
    build = Factory(:build)
    expected = {
      'build' => {
        'id' => build.id,
        'number' => nil,
        'commit' => '62aae5f70ceee39123ef',
        'message' => nil,
        'status' => nil,
        'committed_at' => nil,
        'committer_name' => nil,
        'committer_email' => nil,
        'author_name' => nil,
        'author_email' => nil,
        :repository => {
          'id' => build.repository.id,
          'name' => 'svenfuchs/minimal',
          'url' => 'http://github.com/svenfuchs/minimal',
          'last_duration' => nil,
        },
      }
    }
    assert_equal expected, build.as_json
  end

  test 'as_json(:full => true) includes everything required for the build details view' do
    build = Factory(:build)
    expected = {
      'build' => {
        'id' => build.id,
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
          'name' => 'svenfuchs/minimal',
          'url' => 'http://github.com/svenfuchs/minimal',
          'last_duration' => nil,
        },
      }
    }
    assert_equal expected, build.as_json(:full => true)
  end
end

