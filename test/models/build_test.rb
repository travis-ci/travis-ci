require 'test_helper_rails'

class BuildTest < Test::Unit::TestCase
  test 'as_json includes the required data' do
    build = Factory(:build)
    expected = {
      'build' => {
        'id' => build.id,
        'number' => nil,
        'log' => '',
        :color => '',
        'duration' => nil,
        'started_at' => nil,
        'finished_at' => nil,
        :eta => nil,
        'commit' => '62aae5f70ceee39123ef',
        'message' => nil,
        'committer_name' => nil,
        'committer_email' => nil,
        'committed_at' => nil,
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
end

