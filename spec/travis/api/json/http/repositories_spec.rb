require 'spec_helper'
require 'travis/api'

describe Travis::Api::Json::Http::Repositories do
  let(:repositories) { [repository] }
  let(:repository)   { Scenario.default.first }
  let(:build)        { repository.last_build }
  let(:data)         { Travis::Api::Json::Http::Repositories.new(repositories).data }

  it 'data' do
    data.first.should == {
      'id' => repository.id,
      'slug' => 'svenfuchs/minimal',
      'description' => nil,
      'last_build_id' => build.id,
      'last_build_number' => build.number.to_i,
      'last_build_started_at' => '2010-11-12T12:30:00Z',
      'last_build_finished_at' => '2010-11-12T12:30:20Z',
      'last_build_status' => build.status, # still here for backwards compatibility
      'last_build_result' => build.status,
      'last_build_language' => nil,
      'last_build_duration' => nil,
      'branch_summary' => [{
        'build_id' => build.id,
        'commit' => build.commit.commit,
        'branch' => build.commit.branch,
        'message' => build.commit.message,
        'status' => build.status,
        'started_at' => '2010-11-12T12:30:00Z',
        'finished_at' => '2010-11-12T12:30:20Z',
      }]
    }
  end
end
