require 'test_helper'

class JsonTest < ActiveSupport::TestCase
  attr_reader :now, :build, :repository

  def setup
    @now = Time.now
    Time.stubs(:now).returns(now)

    @build = Factory.create(:build, :started_at => now, :committed_at => now)
    @repository = build.repository
    super
  end

  test 'as_json(:for => :job) includes everything required for the resque build job (2)' do
    expected = { 'id' => build.id, 'number' => '1', 'commit' => '62aae5f70ceee39123ef' }
    assert_equal_hashes expected, build.as_json(:for => :job)

    expected = { 'id' => repository.id, :slug => 'svenfuchs/minimal' }
    assert_equal_hashes expected, repository.as_json(:for => :job)
  end

  test 'as_json(:for => :"build:queued") includes everything required for the build:scheduled event (4)' do
    expected = { 'id' => build.id, 'number' => build.number }
    assert_equal_hashes expected, build.as_json(:for => :'build:queued')

    expected = { 'id' => repository.id, :slug => repository.slug }
    assert_equal_hashes expected, repository.as_json(:for => :'build:queued')
  end

  test 'as_json(:for => :"build:started") includes everything required for the build:started event (4)' do
    expected = {
      'id' => build.id,
      'commit' => '62aae5f70ceee39123ef',
      'branch' => 'master',
      'repository_id' => build.repository.id,
      'number' => '1',
      'started_at' => now,
      'commit' => '62aae5f70ceee39123ef',
      'message' => 'the commit message',
      'committed_at' => now,
      'committer_name' => 'Sven Fuchs',
      'committer_email' => 'svenfuchs@artweb-design.de',
      'author_name' => nil,
      'author_email' => nil,
    }
    assert_equal_hashes expected, build.as_json(:for => :'build:started')

    expected = {
      'id' => repository.id,
      :slug => 'svenfuchs/minimal',
      'last_build_id' => build.id,
      'last_build_number' => '1',
      'last_build_started_at' => now,
    }
    assert_equal_hashes expected, repository.as_json(:for => :'build:started')
  end

  test 'as_json(:for => :"build:configured") includes everything required for the build:configured event (4)' do
    build.update_attributes!(:config => { 'rvm' => ['1.8.7', '1.9.2'] })

    expected = {
      'id'     => build.id,
      'number' => build.number,
      'config' => { 'rvm' => ['1.8.7', '1.9.2'] },
      'matrix' => [
        { 'id' => build.matrix[0].id, 'parent_id' => build.id, 'number' => "#{build.number}.1", 'config' => { 'rvm' => '1.8.7' } },
        { 'id' => build.matrix[1].id, 'parent_id' => build.id, 'number' => "#{build.number}.2", 'config' => { 'rvm' => '1.9.2' } }
      ]
    }
    assert_equal_hashes expected, build.as_json(:for => :'build:configured')

    expected = {
      'id'  => repository.id,
      :slug => 'svenfuchs/minimal'
    }
    assert_equal_hashes expected, repository.as_json(:for => :'build:configured')
  end

  test 'as_json(:for => :"build:log") includes everything required for the build:log event (4)' do
    expected = { 'id' => build.id }
    assert_equal_hashes expected, build.as_json(:for => :'build:log')

    expected = { 'id' => repository.id }
    assert_equal_hashes expected, repository.as_json(:for => :'build:log')
  end

  test 'as_json(:for => :"build:finished") includes everything required for the build:finished event (4)' do
    build.update_attributes(:finished_at => now)

    expected = { 'id' => build.id, 'status' => build.status, 'finished_at' => now }
    assert_equal_hashes expected, build.as_json(:for => :'build:finished')

    expected = {
      'id' => repository.id,
      :slug => 'svenfuchs/minimal',
      'last_build_id' => build.id,
      'last_build_number' => '1',
      'last_build_started_at' => now,
      'last_build_finished_at' => now
    }
    assert_equal_hashes expected, repository.as_json(:for => :'build:finished')
  end
end

