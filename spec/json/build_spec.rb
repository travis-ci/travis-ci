require 'spec_helper'

describe Build, 'json' do
  attr_reader :repository, :build

  before do
    @repository = Scenario.default.first
    @build = repository.reload.last_build
  end

  it 'for the http api' do
    json = json_for(build)
    json.except('matrix').should == {
      'id' => build.id,
      'repository_id' => repository.id,
      'number' => '2',
      'config' => { 'rvm' => ['1.8.7', '1.9.2'], 'gemfile' => ['test/Gemfile.rails-2.3.x', 'test/Gemfile.rails-3.0.x'] },
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
    json['matrix'].first.should == build.matrix.map { |task| json_for(task) }.first
  end

  it 'with :type => :webhook it includes everything required for the client-side build:finished event' do
    json_for(build, :type => :webhook).except('matrix').should == {
      'id' => build.id,
      'repository' => json_for(repository, :type => :webhook),
      'number' => '2',
      'status' => 0,
      'status_message' => 'Passed',
      'started_at' => '2010-11-12T12:30:00Z',
      'finished_at' => '2010-11-12T12:30:20Z',
      'commit' => '91d1b7b2a310131fe3f8',
      'branch' => 'master',
      'compare_url' => 'https://github.com/svenfuchs/minimal/compare/master...develop',
      'message' => 'Bump to 0.0.22',
      'committed_at' => '2010-11-12T12:25:00Z',
      'committer_name' => 'Sven Fuchs',
      'committer_email' => 'svenfuchs@artweb-design.de',
      'author_name' => 'Sven Fuchs',
      'author_email' => 'svenfuchs@artweb-design.de',
    }
  end
end
