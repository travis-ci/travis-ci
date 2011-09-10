require 'spec_helper'

describe 'JSON for websocket events' do

  let(:repository) { Scenario.default.first }
  let(:build) { repository.last_build }
  let(:task) { build.matrix.first }

  it 'build:finished' do
    json_for_pusher('build:finished', build).should == {
      'build' => {
        'id' => build.id,
        'status' => 0,
        'finished_at' => '2010-11-12T12:30:20Z'
      },
      'repository' => {
        'id' => repository.id,
        'slug' => 'svenfuchs/minimal',
        'last_build_id' => build.id,
        'last_build_number' => '2',
        'last_build_started_at' => '2010-11-12T12:30:00Z',
        'last_build_finished_at' => '2010-11-12T12:30:20Z',
        'last_build_status' => 0
      }
    }
  end
end
