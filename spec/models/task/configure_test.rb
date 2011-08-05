require 'spec_helper'

describe Task::Configure do
  let(:now)     { Time.now.tap { |now| Time.stubs(:now).returns(now) } }
  let(:request) { Factory(:request) }

  it "start starts the task and propagates to the request" do
    request.task.start!
    request.reload.should be_started
  end

  it "finish finishes the task and configures the request" do
    config = { :rvm => ['1.8.7', '1.9.2'] }
    request.task.finish!(config)

    request.reload.should be_finished
    request.task.should be_finished
    request.config.should == config
  end
end

