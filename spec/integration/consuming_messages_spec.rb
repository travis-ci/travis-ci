require 'spec_helper'

describe Travis, 'consuming worker messages' do
  let(:consumer) { Travis::Consumer.new }
  let(:request)  { Factory(:request) }
  let(:build)    { Factory(:build, :config => { :rvm => ['1.8.7', '1.9.2'] }) }

  let(:message)  { stub(:type => event, :ack => nil) }

  def payload(task)
    MultiJson.encode(WORKER_PAYLOADS[event].merge('id' => task.id))
  end

  before(:each) do
    Travis.config.notifications = [:pusher]
  end

  describe 'job:configure:finished' do
    let(:event) { 'job:configure:finished' }
    let(:task)  { request.task }

    it "finishes the request's configure task" do
      consumer.receive(message, payload(task))
      task.reload.should be_finished
    end

    it 'finishes the request' do
      consumer.receive(message, payload(task))
      request.reload.should be_finished
    end

    it 'creates a new build' do
      reception = lambda { consumer.receive(message, payload(task)) }
      reception.should change(Build, :count).by(1)
      request.builds.should_not be_empty
    end

    it "creates the build's matrix test tasks" do
      reception = lambda { consumer.receive(message, payload(task)) }
      reception.should change(Task::Test, :count).by(2)
      request.builds.first.matrix.should_not be_empty
    end
  end

  describe 'job:test:started' do
    let(:event) { 'job:test:started' }
    let(:task)  { build.matrix.first }

    it 'starts the task' do
      consumer.receive(message, payload(task))
      task.reload.should be_started
    end

    it 'starts the build' do
      consumer.receive(message, payload(task))
      build.reload.should be_started
    end
  end

  describe 'a task log payload' do
    let(:event) { 'job:test:log' }
    let(:task)  { build.matrix.first }

    it "appends the log output to the task's log" do
      consumer.receive(message, payload(task))
      task.reload.log.should == '... appended'
    end
  end

  describe 'job:test:finished' do
    let(:event) { 'job:test:finished' }
    let(:task)  { build.matrix.first }

    it 'finishes a matrix test task' do
      consumer.receive(message, payload(task))
      task.reload.should be_finished
    end

    it 'but does not finish the build if a task is still pending' do
      consumer.receive(message, payload(task))
      build.reload.should_not be_finished
    end

    it 'and finishes the build if all tasks are finished' do
      build.matrix.each do |task|
        consumer.receive(message, payload(task))
      end
      build.reload.should be_finished
    end
  end
end
