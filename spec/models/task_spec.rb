require 'spec_helper'

describe ::Task do
  attr_reader :build, :job

  let!(:build) { Factory(:build, :config => { :rvm => ['1.8.7', '1.9.2'] }) }
  let!(:job)  { build.matrix.first }

  context :append_log! do
    it 'appends streamed build log chunks' do
      lines = [
        "$ git clone --depth=1000 --quiet git://github.com/intridea/omniauth.git ~/builds/intridea/omniauth\n",
        "$ git checkout -qf 662af2708525b776aac580b10cc903ba66050e06\n",
        "$ bundle install --pa"
      ]
      0.upto(2) do |ix|
        Task::Test.append_log!(job.id, lines[ix])
        assert_equal lines[0, ix + 1].join, job.reload.log
      end
    end

    it 'notifies observers' do
      Travis::Notifications.expects(:dispatch).with('job:test:log', job, :build => { :_log => 'chars' })
      Task::Test.append_log!(job.id, 'chars')
    end
  end
end

