require 'spec_helper'

class Build
  attr_accessor :state
  def denormalize(*); end
end

describe Travis::Model::Build do
  let(:record) { Build.new }
  let(:build)  { Travis::Model::Build.new(record) }

  before :each do
  end

  describe 'events' do
    describe 'starting the build' do
      it 'sets the state to :started' do
        build.start
        build.state.should == :started
      end

      it 'denormalizes record attributes' do
        build.record.expects(:denormalize)
        build.start
      end
    end

    describe 'finishing the build' do
      describe 'when the matrix is not finished' do
        before(:each) do
          record.stubs(:matrix_finished? => false)
        end

        it 'does not change the state' do
          build.finish
          build.state.should == :created
        end

        it 'does not denormalizes record attributes' do
          build.record.expects(:denormalize).never
          build.finish
        end
      end

      describe 'when the matrix is finished' do
        before(:each) do
          record.stubs(:matrix_finished? => true)
        end

        it 'sets the state to :finished' do
          build.finish
          build.state.should == :finished
        end

        it 'denormalizes record attributes' do
          data = { :status => 0, :finished_at => Time.now }
          build.record.expects(:denormalize).with(:finish, data)
          build.finish(data)
        end
      end
    end
  end
end

