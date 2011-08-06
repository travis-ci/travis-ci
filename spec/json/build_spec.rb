require 'spec_helper'

describe Build, 'json' do
  attr_reader :repository, :build

  before do
    @repository = Scenario.default.first
    @build = repository.reload.builds.first
  end

  it 'for the http api' do
    json = render_json(build)
    json.except('matrix').should == {
      'id' => build.id,
      'repository_id' => repository.id,
      'number' => '1',
      'config' => { 'rvm' => ['1.8.7', '1.9.2'], 'gemfile' => ['test/Gemfile.rails-2.3.x', 'test/Gemfile.rails-3.0.x'] },
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
    json['matrix'].first.should == build.matrix.map { |task| render_json(task) }.first
  end

  it 'with :type => :event, :template => "build_queued/build" it includes everything required for the client-side build:scheduled event' do
    render_json(build, :type => :event, :template => 'build_queued/build').should == {
      'id' => build.id,
      'number' => '1'
    }
  end

  it 'with :type => :event, :template => "build_started/build" it includes everything required for the client-side build:scheduled event' do
    json = render_json(build, :type => :event, :template => 'build_started/build')
    json.except('matrix').should == {
      'id' => build.id,
      'repository_id' => build.repository.id,
      'number' => '1',
      'started_at' => '2010-11-12T12:00:00Z',
      'commit' => '1a738d9d6f297c105ae2',
      'branch' => 'master',
      'compare_url' => 'https://github.com/svenfuchs/minimal/compare/master...develop',
      'message' => 'add Gemfile',
      'committed_at' => '2010-11-12T11:50:00Z',
      'committer_name' => 'Sven Fuchs',
      'committer_email' => 'svenfuchs@artweb-design.de',
      'author_name' => 'Sven Fuchs',
      'author_email' => 'svenfuchs@artweb-design.de',
    }
    json['matrix'].first.should == build.matrix.map { |task| render_json(task) }.first
  end

  # will see if we can entirely remove this event
  #
  # it 'with :type => :event, :template => "build_configured/build" it includes everything required for the client-side build:configured event' do
  #   render_json(build, :type => :event, :template => 'build_configured/build').should == {
  #     'id' => build.id,
  #     'repository_id' => build.repository.id,
  #     'number' => '1',
  #     'commit' => '1a738d9d6f297c105ae2',
  #     'branch' => 'master',
  #     'compare_url' => 'https://github.com/svenfuchs/minimal/compare/master...develop',
  #     'started_at' => '2010-11-12T12:00:00Z',
  #     'message' => 'add Gemfile',
  #     'committed_at' => '2010-11-12T11:50:00Z',
  #     'committer_name' => 'Sven Fuchs',
  #     'committer_email' => 'svenfuchs@artweb-design.de',
  #     'author_name' => 'Sven Fuchs',
  #     'author_email' => 'svenfuchs@artweb-design.de',
  #     'matrix' => ...
  #   }
  # end

  it 'with :type => :event, :template => "build_log/build" it includes everything required for the client-side build:log event' do
    render_json(build, :type => :event, :template => 'build_log/build').should == {
      'id' => build.id,
    }
  end

  it 'with :type => :event, :template => "build_finished/build" it includes everything required for the client-side build:finished event' do
    render_json(build, :type => :event, :template => 'build_finished/build').should == {
      'id' => build.id,
      'status' => 1,
      'finished_at' => '2010-11-12T12:00:10Z'
    }
  end

  it 'with :type => :webhook it includes everything required for the client-side build:finished event' do
    render_json(build, :type => :webhook).except('matrix').should == {
      'id' => build.id,
      'repository' => render_json(repository, :type => :webhook),
      'number' => '1',
      'status' => 1,
      'status_message' => 'Failed',
      'started_at' => '2010-11-12T12:00:00Z',
      'finished_at' => '2010-11-12T12:00:10Z',
      'commit' => '1a738d9d6f297c105ae2',
      'branch' => 'master',
      'compare_url' => 'https://github.com/svenfuchs/minimal/compare/master...develop',
      'message' => 'add Gemfile',
      'committed_at' => '2010-11-12T11:50:00Z',
      'committer_name' => 'Sven Fuchs',
      'committer_email' => 'svenfuchs@artweb-design.de',
      'author_name' => 'Sven Fuchs',
      'author_email' => 'svenfuchs@artweb-design.de',
    }
  end
end
