require 'spec_helper'

describe 'JSON for worker jobs' do

  let(:repository) { Scenario.default.first }
  let(:build) { repository.last_build }
  let(:task) { build.matrix.first }

  it 'Task::Test' do
    json_for_worker(task).should == {
      'build' => {
        'id' => task.id,
        'config' => { 'rvm' => '1.8.7', 'gemfile' => 'test/Gemfile.rails-2.3.x' },
        'number' => '2.1',
        'commit' => '91d1b7b2a310131fe3f8',
        'branch' => 'master'
      },
      'repository' => {
        'id' => repository.id,
        'slug' => 'svenfuchs/minimal'
      }
    }
  end
end
