require 'spec_helper'

describe ::Task::Test do
  let(:now)   { Time.now.tap { |now| Time.stubs(:now).returns(now) } }
  let(:build) { Factory(:build, :config => { :rvm => ['1.8.7', '1.9.2'] }) }

  it "start starts the task and propagates to the build" do
    task = build.matrix.first
    task.start!

    task.reload.should be_started
    build.reload.should be_started
  end

  it "finish finishes the task, sets the status and, when all of the tasks are finished, the build" do
    tasks = build.matrix
    tasks.first.start!
    tasks.first.finish!(:status => 0)

    build.reload.should be_started
    tasks.first.should be_finished
    tasks.first.status.should == 0

    tasks.second.finish!(:status => 0)
    build.reload.should be_finished
    tasks.second.should be_finished
    tasks.second.status.should == 0
    build.status.should == 0
  end

  it "appends streamed build log chunks" do
    task = build.matrix.first
    lines = [
      "$ git clone --depth=1000 --quiet git://github.com/intridea/omniauth.git ~/builds/intridea/omniauth\n",
      "$ git checkout -qf 662af2708525b776aac580b10cc903ba66050e06\n",
      "$ bundle install --pa"
    ]
    0.upto(2) do |ix|
      task.append_log!(lines[ix])
      task.reload
      assert_equal lines[0, ix + 1].join, task.log
    end
  end
end


