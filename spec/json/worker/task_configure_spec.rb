require 'spec_helper'

describe 'JSON for worker jobs' do

  let(:repository) { Scenario.default.first }
  let(:job) { repository.requests.first.job }

  it 'Task::Configure' do
    json_for_worker(job, 'queue' => 'builds').should == {
      'build' => {
        'id' => job.id,
        'commit' => '62aae5f70ceee39123ef',
        'branch' => 'master',
      },
      'repository' => {
        'id' => repository.id,
        'slug' => 'svenfuchs/minimal'
      },
      'queue' => 'builds'
    }
  end
end
