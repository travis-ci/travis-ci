require 'spec_helper'

describe 'JSON for websocket events' do

  let(:repository) { Scenario.default.first }
  let(:build) { repository.last_build }
  let(:task) { build.matrix.first }

  it 'build:started' do
    data = json_for_pusher('build:started', build)

    data['build'].except('matrix').should == {
      'id' => build.id,
      'repository_id' => repository.id,
      'number' => '2',
      'config' => { 'rvm' => ['1.8.7', '1.9.2'], 'gemfile' => ['test/Gemfile.rails-2.3.x', 'test/Gemfile.rails-3.0.x'] },
      'status' => 0,
      'started_at' => '2010-11-12T12:30:00Z',
      'commit' => "91d1b7b2a310131fe3f8",
      'branch' => "master",
      'message' => 'Bump to 0.0.22',
      'author_name' => "Sven Fuchs",
      'author_email' => "svenfuchs@artweb-design.de",
      'committer_name' => "Sven Fuchs",
      'committer_email' => "svenfuchs@artweb-design.de",
      'committed_at' => '2010-11-12T12:25:00Z',
      'compare_url' => "https://github.com/svenfuchs/minimal/compare/master...develop",
    }
    data['build']['matrix'].first.should == {
      'id' => task.id,
      'repository_id' => repository.id,
      'parent_id' => build.id,
      'number' => '2.1',
      'config' => { 'rvm' => '1.8.7', 'gemfile' => 'test/Gemfile.rails-2.3.x' },
      'commit' => "91d1b7b2a310131fe3f8",
      'branch' => "master",
      'message' => 'Bump to 0.0.22',
      'author_name' => "Sven Fuchs",
      'author_email' => "svenfuchs@artweb-design.de",
      'committer_name' => "Sven Fuchs",
      'committer_email' => "svenfuchs@artweb-design.de",
      'committed_at' => '2010-11-12T12:25:00Z',
      'compare_url' => "https://github.com/svenfuchs/minimal/compare/master...develop",
    }
    data['repository'].should == {
      'id' => repository.id,
      'slug' => 'svenfuchs/minimal',
      'last_build_finished_at' => '2010-11-12T12:30:20Z',
      'last_build_id' => build.id,
      'last_build_number' => '2',
      'last_build_started_at' => '2010-11-12T12:30:00Z',
      'last_build_status' => 0
    }
  end
end
