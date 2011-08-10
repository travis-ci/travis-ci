require 'spec_helper'

describe Repository, 'json' do
  attr_reader :repository, :last_build

  before do
    @repository = Scenario.default.first
    @last_build = repository.last_build
  end

  it 'returns the expected json' do
    json_for(repository).should == {
      'id' => repository.id,
      'slug' => 'svenfuchs/minimal',
      'last_build_id' => last_build.id,
      'last_build_number' => last_build.number.to_i,
      'last_build_status' => last_build.status,
      'last_build_started_at' => '2010-11-12T12:30:00Z',
      'last_build_finished_at' => '2010-11-12T12:30:20Z'
    }
  end

  it 'json_for with :type => :job includes everything required for the build job' do
    json_for(repository, :type => :job).should == {
      'id' => repository.id,
      'slug' => 'svenfuchs/minimal'
    }
  end

  it 'with :type => :webhook it includes everything required for the client-side build:finished event' do
    json_for(repository, :type => :webhook).should == {
      'id' => repository.id,
      'name' => 'minimal',
      'owner_name' => 'svenfuchs',
      'url' => 'http://github.com/svenfuchs/minimal'
    }
  end
end
