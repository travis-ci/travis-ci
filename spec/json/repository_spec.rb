require 'spec_helper'

describe Repository, 'json' do
  attr_reader :repository, :last_build

  before do
    @repository = Scenario.default.first
    @last_build = repository.last_build
  end

  it 'returns the expected json' do
    render_json(repository).should == {
      'id' => repository.id,
      'slug' => 'svenfuchs/minimal',
      'last_build_id' => last_build.id,
      'last_build_number' => last_build.number.to_i,
      'last_build_status' => last_build.status,
      'last_build_started_at' => '2010-11-12T12:30:00Z',
      'last_build_finished_at' => '2010-11-12T12:30:20Z'
    }
  end

  it 'render_json with :type => :job includes everything required for the build job' do
    render_json(repository, :type => :job).should == {
      'id' => repository.id,
      'slug' => 'svenfuchs/minimal'
    }
  end

  it 'render_json with :type => :event, :template => "build_queued/repository" includes everything required for the client-side build:scheduled event' do
    render_json(repository, :type => :event, :template => 'build_queued/repository').should == {
      'id' => repository.id,
      'slug' => 'svenfuchs/minimal'
    }
  end

  it 'with :type => :event, :template => "build_started/repository" includes everything required for the client-side build:scheduled event' do
    render_json(repository, :type => :event, :template => 'build_started/repository').should == {
      'id' => repository.id,
      'slug' => 'svenfuchs/minimal',
      'last_build_id' => last_build.id,
      'last_build_number' => last_build.number.to_i,
      'last_build_started_at' => '2010-11-12T12:30:00Z',
      'last_build_finished_at' => '2010-11-12T12:30:20Z' # this obviously would be nil, but the fixture has a finished_at date
    }
  end

  # will see if we can entirely remove this event
  #
  # it 'with :type => :event, :template => "build_configured/repository" includes everything required for the client-side build:configured event' do
  #   render_json(repository, :type => :event, :template => 'build_configured/repository').should == {
  #     'id' => repository.id,
  #     'slug' => 'svenfuchs/minimal',
  #     'last_build_id' => last_build.id,
  #     'last_build_number' => last_build.number.to_i,
  #     'last_build_started_at' => '2010-11-12T12:30:00Z',
  #   }
  # end

  it 'with :type => :event, :template => "build_log/repository" includes everything required for the client-side build:log event' do
    render_json(repository, :type => :event, :template => 'build_log/repository').should == {
      'id' => repository.id,
    }
  end

  it 'with :type => :event, :template => "build_finished/repository" includes everything required for the client-side build:finished event' do
    render_json(repository, :type => :event, :template => 'build_finished/repository').should == {
      'id' => repository.id,
      'slug' => 'svenfuchs/minimal',
      'last_build_id' => last_build.id,
      'last_build_number' => last_build.number.to_i,
      'last_build_started_at' => '2010-11-12T12:30:00Z',
      'last_build_finished_at' => '2010-11-12T12:30:20Z',
    }
  end

  it 'with :type => :webhook it includes everything required for the client-side build:finished event' do
    render_json(repository, :type => :webhook).should == {
      'id' => repository.id,
      'name' => 'minimal',
      'owner_name' => 'svenfuchs',
      'url' => 'http://github.com/svenfuchs/minimal'
    }
  end
end
