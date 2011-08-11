require 'spec_helper'

describe 'JSON for websocket events' do

  let(:repository) { Scenario.default.first }
  let(:build) { repository.last_build }
  let(:task) { build.matrix.first }

  it 'build:log' do
    json_for_pusher('build:log', build).should == {
      'build' => {
        'id' => build.id,
      },
      'repository' => {
        'id' => 1,
      }
    }
  end
end
