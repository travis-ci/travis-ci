require 'spec_helper'

describe 'JSON for websocket events' do

  let(:repository) { Scenario.default.first }
  let(:build) { repository.last_build }
  let(:job) { build.matrix.first }

  it 'build:queued' do
    job.update_attributes!(:queue => 'builds.common')

    json_for_pusher('build:queued', job).should == {
     'build' => {
       'id' => job.id,
       'number' => '2.1',
       'queue' => 'builds.common'
      },
      'repository' => {
        'id' => repository.id,
        'slug' => "svenfuchs/minimal"
      }
    }
  end
end
