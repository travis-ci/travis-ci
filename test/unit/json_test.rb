require 'test_helper'

class JsonTest < ActiveSupport::TestCase
  attr_reader :now, :build, :repository

  def setup
    @now = Time.now
    Time.stubs(:now).returns(now)

    @build = FactoryGirl.create(:build, :started_at => now, :committed_at => now)
    @repository = build.repository
    super
  end

  test 'as_json(:for => :job) includes everything required for the resque build job (2)' do
    expected = { 'id' => build.id, 'number' => '1', 'commit' => '62aae5f70ceee39123ef', 'branch' => 'master' }
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
      'repository_id' => build.repository.id,
      'number' => '1',
      'commit' => '62aae5f70ceee39123ef',
      'branch' => 'master',
      'started_at' => now,
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

    build_base = {
      'repository_id' => build.repository.id,
      'number' => '1',
      'commit' => '62aae5f70ceee39123ef',
      'branch' => 'master',
      'started_at' => now,
      'message' => 'the commit message',
      'committed_at' => now,
      'committer_name' => 'Sven Fuchs',
      'committer_email' => 'svenfuchs@artweb-design.de',
    }

    expected = build_base.merge(
      'id' => build.id,
      'config' => { 'rvm' => ['1.8.7', '1.9.2'] },
      'author_name' => nil,
      'author_email' => nil,
      'matrix' => [
        build_base.merge('id' => build.matrix[0].id, 'parent_id' => build.id, 'number' => "#{build.number}.1", 'config' => { 'rvm' => '1.8.7' }),
        build_base.merge('id' => build.matrix[1].id, 'parent_id' => build.id, 'number' => "#{build.number}.2", 'config' => { 'rvm' => '1.9.2' })
      ]
    );
    assert_equal_hashes expected, build.as_json(:for => :'build:configured')

    expected = {
      'id' => repository.id,
      :slug => 'svenfuchs/minimal',
      'last_build_id' => build.id,
      'last_build_number' => '1',
      'last_build_started_at' => now,
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

  test "as_json(:for => :webhook) includes everything required for the webhook" do
    build.update_attributes(:compare_url => 'compare_url')

    expected = {
      "id" => build.id,
      :repository => {
        "id" => build.repository.id,
        "name" => "minimal",
        "owner_name" => "svenfuchs"
      },
      "number" => "1",
      "branch" => "master",
      "commit" => '62aae5f70ceee39123ef',
      "message" => "the commit message",
      "status" => build.status,
      :status_message => "Failed",
      "committed_at" =>  build.committed_at,
      "committer_email" => "svenfuchs@artweb-design.de",
      "committer_name" => "Sven Fuchs",
      "finished_at" => build.finished_at,
      "started_at" => build.started_at,
      :github_url => "http://github.com/svenfuchs/minimal",
      'compare_url' => 'compare_url'
    }
    assert_equal_hashes expected, build.as_json(:for => :webhook)
  end
end

