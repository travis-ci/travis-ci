require 'spec_helper'

describe Task, 'json' do
  describe 'rendering a Task::Configure' do
    attr_reader :repository, :build, :task

    before do
      @task = Factory(:request).task
    end

    it 'render_json with :type => :job includes everything required for the build job' do
      render_json(task, :type => :job).should == {
        'id' => task.id,
        'commit' => '62aae5f70ceee39123ef',
        'branch' => 'master',
      }
    end
  end

  describe 'rendering a Task::Test' do
    attr_reader :repository, :build, :task

    before do
      @repository = Scenario.default.first
      @build = repository.reload.last_build
      @task  = build.matrix.first
    end

    it 'as_json returns data for the http api' do
      render_json(task).should == {
        'id' => task.id,
        'parent_id' => build.id,
        'repository_id' => repository.id,
        'number' => '2.1',
        'config' => { 'rvm' => '1.8.7', 'gemfile' => 'test/Gemfile.rails-2.3.x' },
        'state' => 'finished',
        'status' => 0,
        'started_at' => '2010-11-12T12:30:00Z',
        'finished_at' => '2010-11-12T12:30:20Z',
        'commit' => '91d1b7b2a310131fe3f8',
        'branch' => 'master',
        'compare_url' => 'https://github.com/svenfuchs/minimal/compare/master...develop',
        'message' => 'Bump to 0.0.22',
        'committed_at' => '2010-11-12T12:25:00Z',
        'committer_email' => 'svenfuchs@artweb-design.de',
        'committer_name' => 'Sven Fuchs',
        'author_name' => 'Sven Fuchs',
        'author_email' => 'svenfuchs@artweb-design.de',
      }
    end

    it 'render_json with :type => :job includes everything required for the build job' do
      render_json(task, :type => :job).should == {
        'id' => task.id,
        'config' => { 'rvm' => '1.8.7', 'gemfile' => 'test/Gemfile.rails-2.3.x' },
        'number' => '2.1',
        'commit' => '91d1b7b2a310131fe3f8',
        'branch' => 'master',
      }
    end
  end
end
