# TODO port to travis-hub
#
# require 'spec_helper'
#
# describe Travis, 'consuming worker messages' do
#   let(:consumer) { Travis::Hub.new }
#   let(:request)  { Factory(:request) }
#   let(:build)    { Factory(:build, :config => { :rvm => ['1.8.7', '1.9.2'] }) }
#
#   let(:message)  { stub(:type => event, :ack => nil) }
#
#   def payload(job)
#     MultiJson.encode(WORKER_PAYLOADS[event].merge('id' => job.id))
#   end
#
#   before(:each) do
#     Travis.config.notifications = [:pusher]
#   end
#
#   describe 'job:configure:finished' do
#     let(:event) { 'job:configure:finished' }
#     let(:job)  { request.job }
#
#     it "finishes the request's configure job" do
#       consumer.receive(message, payload(job))
#       job.reload.should be_finished
#     end
#
#     it 'finishes the request' do
#       consumer.receive(message, payload(job))
#       request.reload.should be_finished
#     end
#
#     it 'creates a new build' do
#       reception = lambda { consumer.receive(message, payload(job)) }
#       reception.should change(Build, :count).by(1)
#       request.builds.should_not be_empty
#     end
#
#     it "creates the build's matrix test jobs" do
#       reception = lambda { consumer.receive(message, payload(job)) }
#       reception.should change(Job::Test, :count).by(2)
#       request.builds.first.matrix.should_not be_empty
#     end
#   end
#
#   describe 'job:test:started' do
#     let(:event) { 'job:test:started' }
#     let(:job)  { build.matrix.first }
#
#     it 'starts the job' do
#       consumer.receive(message, payload(job))
#       job.reload.should be_started
#     end
#
#     it 'starts the build' do
#       consumer.receive(message, payload(job))
#       build.reload.should be_started
#     end
#   end
#
#   describe 'a job log payload' do
#     let(:event) { 'job:test:log' }
#     let(:job)  { build.matrix.first }
#
#     it "appends the log output to the job's log" do
#       consumer.receive(message, payload(job))
#       job.reload.log.content.should == '... appended'
#     end
#   end
#
#   describe 'job:test:finished' do
#     let(:event) { 'job:test:finished' }
#     let(:job)  { build.matrix.first }
#
#     it 'finishes a matrix test job' do
#       consumer.receive(message, payload(job))
#       job.reload.should be_finished
#     end
#
#     it 'but does not finish the build if a job is still pending' do
#       consumer.receive(message, payload(job))
#       build.reload.should_not be_finished
#     end
#
#     it 'and finishes the build if all jobs are finished' do
#       build.matrix.each do |job|
#         consumer.receive(message, payload(job))
#       end
#       build.reload.should be_finished
#     end
#   end
# end
