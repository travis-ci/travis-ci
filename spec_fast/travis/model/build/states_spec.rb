require 'spec_helper'

class BuildMock
  include Build::States
  class << self; def name; 'Build'; end; end
  attr_accessor :state, :status, :started_at, :finished_at
  def denormalize(*); end
end

describe Build::States do
  let(:build) { BuildMock.new }

  describe 'events' do
    describe 'starting the build' do
      let(:data) { WORKER_PAYLOADS['job:test:started'] }

      it 'sets the state to :started' do
        build.start(data)
        build.state.should == :started
      end

      it 'denormalizes attributes' do
        build.expects(:denormalize)
        build.start(data)
      end

      it 'notifies observers' do
        Travis::Notifications.expects(:dispatch).with('build:started', build, data)
        build.start(data)
      end
    end

    describe 'finishing the build' do
      let(:data) { WORKER_PAYLOADS['job:test:finished'] }

      describe 'when the matrix is not finished' do
        before(:each) do
          build.stubs(:matrix_finished? => false)
        end

        it 'does not change the state' do
          build.finish(data)
          build.state.should == :created
        end

        it 'does not denormalizes attributes' do
          build.expects(:denormalize).never
          build.finish(data)
        end

        it 'does not notify observers' do
          Travis::Notifications.expects(:dispatch).never
          build.finish(data)
        end
      end

      describe 'when the matrix is finished' do
        before(:each) do
          build.stubs(:matrix_finished? => true, :matrix_status => 0)
        end

        it 'sets the state to :finished' do
          build.finish(data)
          build.state.should == :finished
        end

        it 'denormalizes attributes' do
          build.expects(:denormalize).with(:finish, data)
          build.finish(data)
        end

        it 'notifies observers' do
          Travis::Notifications.expects(:dispatch).with('build:started', build, data)
          build.start(data)
        end
      end
    end
  end
end
