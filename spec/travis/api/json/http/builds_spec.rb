require 'spec_helper'
require 'travis/api'

describe Travis::Api::Json::Http::Builds do
  let(:repository) { Scenario.default.first }
  let(:builds) { [build] }
  let(:build)  { repository.last_build }
  let(:data)   { Travis::Api::Json::Http::Builds.new(builds).data }

  before :each do
    build.request.event_type = 'push'
  end

  it 'builds' do
    data.first.should == {
      'id' => build.id,
      'event_type' => 'push', # on the build api this probably should be just 'pull_request' => true or similar
      'repository_id' => repository.id,
      'number' => '2',
      'state' => 'finished',
      'started_at' => '2010-11-12T12:30:00Z',
      'finished_at' => '2010-11-12T12:30:20Z',
      'duration' => nil,
      'result' => 0,
      'commit' => '91d1b7b2a310131fe3f8',
      'branch' => 'master',
      'message' => 'Bump to 0.0.22'
    }
  end
end

