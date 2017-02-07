require 'spec_helper'

describe 'JSON for worker jobs' do

  let(:repository) { Scenario.default.first }
  let(:task) { repository.requests.first.task }

  it 'Task::Configure' do
    json_for_worker(task, 'queue' => 'builds').should == {
      'build' => {
        'id' => task.id,
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
