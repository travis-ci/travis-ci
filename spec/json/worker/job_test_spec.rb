require 'spec_helper'

describe 'JSON for worker jobs' do

  let(:repository) { Scenario.default.first }
  let(:build) { repository.last_build }
  let(:job) { build.matrix.first }

  it 'Job::Test' do
    json_for_worker(job).should == {
      'build' => {
        'id' => job.id,
        'number' => '2.1',
        'commit' => '91d1b7b2a310131fe3f8',
        'branch' => 'master'
      },
      'repository' => {
        'id' => repository.id,
        'slug' => 'svenfuchs/minimal'
      },
      'config' => {
        'rvm' => '1.8.7',
        'gemfile' => 'test/Gemfile.rails-2.3.x'
      },
      'queue' => 'builds.common'
    }
  end
end
