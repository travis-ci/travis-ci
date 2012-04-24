require 'spec_helper'
require 'travis/api'

describe Travis::Api::Json::Http::Jobs do
  let(:repository) { Scenario.default.first }
  let(:build) { repository.last_build }
  let(:jobs)  { build.matrix }
  let(:job)   { jobs.first }
  let(:data)  { Travis::Api::Json::Http::Jobs.new(jobs).data }

  it 'jobs' do
    data.first.should == {
      'id' => job.id,
      'repository_id' => job.repository_id,
      'number' => '2.1',
      'queue' => 'builds.common',
      'state' => 'finished',
      'allow_failure' => false
    }
  end
end

