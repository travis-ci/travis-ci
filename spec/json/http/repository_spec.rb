require 'spec_helper'

describe 'HTTP API for Repository' do

  let(:repository) { Scenario.default.first }
  let(:build) { repository.last_build }

  it 'json' do
    json_for_http(repository).should == {
      'id' => repository.id,
      'description' => nil,
      'last_build_id' => build.id,
      'last_build_number' => build.number.to_i,
      'last_build_started_at' => '2010-11-12T12:30:00Z',
      'last_build_finished_at' => '2010-11-12T12:30:20Z',
      'last_build_status' => build.status, # still here for backwards compatibility
      'last_build_result' => build.status,
      'last_build_language' => nil,
      'last_build_duration' => nil,
      'slug' => 'svenfuchs/minimal',
    }
  end
end
