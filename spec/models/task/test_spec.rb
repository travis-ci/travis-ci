require 'spec_helper'

describe ::Task::Test do
  attr_reader :build, :task, :first, :second

  before do
    @build  = Factory(:build, :config => { :rvm => ['1.8.7', '1.9.2'] })
    @first  = build.matrix.first
    @second = build.matrix.second
    @task   = first
    # Travis::Notifications.stubs(:dispatch)
  end

  let(:now)   { Time.now.tap { |now| Time.stubs(:now).returns(now) } }

  describe 'start' do
    it 'starts the task and propagates to the build' do
      task.start!
      task.reload.should be_started
      build.reload.should be_started
    end

    it 'notifies observers' do
      Travis::Notifications.expects(:dispatch).with('build:started', task)
      task.start!
    end
  end

  describe 'append_log!' do
    it 'appends streamed build log chunks' do
      task = build.matrix.first
      lines = [
        "$ git clone --depth=1000 --quiet git://github.com/intridea/omniauth.git ~/builds/intridea/omniauth\n",
        "$ git checkout -qf 662af2708525b776aac580b10cc903ba66050e06\n",
        "$ bundle install --pa"
      ]
      0.upto(2) do |ix|
        Task::Test.append_log!(task.id, lines[ix])
        assert_equal lines[0, ix + 1].join, task.reload.log
      end
    end

    it 'notifies observers' do
      Travis::Notifications.expects(:dispatch).with('build:log', task, :log => 'chars')
      Task::Test.append_log!(task.id, 'chars')
    end
  end

  describe 'finish' do
    it 'finishes the task, sets the status and, when all of the tasks are finished, the build' do
      first.start!
      first.finish!(:status => 0)

      build.reload.should be_started
      first.reload.should be_finished
      first.status.should == 0

      second.finish!(:status => 0)

      build.reload.should be_finished
      build.status.should == 0
      second.reload.should be_finished
      second.status.should == 0
    end

    it 'notifies observers' do
      Travis::Notifications.expects(:dispatch).with('build:started', first)
      Travis::Notifications.expects(:dispatch).with('build:finished', first, :status => 0)

      first.start!
      first.finish!(:status => 0)
    end
  end
end
