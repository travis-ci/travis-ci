require 'spec_helper'

describe 'Event (pusher)', 'json' do

  let(:repository) { Scenario.default.first }
  let(:build) { repository.last_build }
  let(:task) { build.matrix.first }

  def json_for(event, object)
    normalize_json(Travis::Notifications::Pusher::Message.new(event, object).to_hash)
  end

  it 'build:queued' do
    json_for('build:queued', task).should == {
     'build' => {
       'id' => task.id,
       'number' => '2.1'
      },
      'repository' => {
        'id' => repository.id,
        'slug' => "svenfuchs/minimal"
      }
    }
  end

  it 'build:removed' do
    json_for('build:removed', task).should == {
     'build' => {
       'id' => task.id,
       'number' => '2.1'
      },
      'repository' => {
        'id' => repository.id,
        'slug' => "svenfuchs/minimal"
      }
    }
  end

  it 'build:started' do
    data = json_for('build:started', build)

    data['build'].except('matrix').should == {
      'id' => build.id,
      'repository_id' => repository.id,
      'number' => '2',
      'config' => { 'rvm' => ['1.8.7', '1.9.2'], 'gemfile' => ['test/Gemfile.rails-2.3.x', 'test/Gemfile.rails-3.0.x'] },
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
    data['repository'].should == {
      'id' => repository.id,
      'slug' => 'svenfuchs/minimal',
      'last_build_finished_at' => '2010-11-12T12:30:20Z',
      'last_build_id' => 2,
      'last_build_number' => '2',
      'last_build_started_at' => '2010-11-12T12:30:00Z',
    }
  end

  it 'build:log' do
    json_for('build:log', build).should == {
      'build' => {
        'id' => build.id,
      },
      'repository' => {
        'id' => 1,
      }
    }
  end

  it 'build:finished' do
    json_for('build:finished', build).should == {
      'build' => {
        'id' => build.id,
        'status' => 0,
        'finished_at' => '2010-11-12T12:30:20Z'
      },
      'repository' => {
        'id' => 1,
        'slug' => 'svenfuchs/minimal',
        'last_build_id' => 2,
        'last_build_number' => '2',
        'last_build_started_at' => '2010-11-12T12:30:00Z',
        'last_build_finished_at' => '2010-11-12T12:30:20Z',
      }
    }
  end
end

