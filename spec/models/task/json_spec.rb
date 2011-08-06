require 'spec_helper'

describe Task, 'json' do
  attr_reader :repository, :build, :task

  before do
    @repository = Scenario.default.first
    @build = repository.reload.builds.first
    @task = build.matrix.first
  end

  it 'as_json returns data for the http api' do
    to_json(task).should == {
      'id' => task.id,
      'parent_id' => build.id,
      'repository_id' => repository.id,
      'number' => '1.1',
      'config' => { 'rvm' => '1.8.7', 'gemfile' => 'test/Gemfile.rails-2.3.x' },
      'state' => 'finished',
      'status' => 1,
      'started_at' => '2010-11-12T12:00:00Z',
      'finished_at' => '2010-11-12T12:00:10Z',
      'commit' => '1a738d9d6f297c105ae2',
      'branch' => 'master',
      'compare_url' => 'https://github.com/svenfuchs/minimal/compare/master...develop',
      'message' => 'add Gemfile',
      'committed_at' => '2010-11-12T11:50:00Z',
      'committer_email' => 'svenfuchs@artweb-design.de',
      'committer_name' => 'Sven Fuchs',
      'author_name' => 'Sven Fuchs',
      'author_email' => 'svenfuchs@artweb-design.de',
    }
  end

  it 'as_json(:for => :job) includes everything required for the resque build job' do
    to_json(task, :for => :job).should == {
      'id' => task.id,
      'config' => { 'rvm' => '1.8.7', 'gemfile' => 'test/Gemfile.rails-2.3.x' },
      'number' => '1.1',
      'commit' => '1a738d9d6f297c105ae2',
      'branch' => 'master',
    }
  end
end
