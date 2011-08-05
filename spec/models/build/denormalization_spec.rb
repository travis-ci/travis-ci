require 'spec_helper'

describe Build, 'denormalization' do
  let(:build) { Factory(:build) }

  describe 'on build:started' do
    it 'denormalizes last_build_id to its repository' do
      build.start!

      build.repository.last_build_id.should == build.id
    end

    it 'denormalizes last_build_number to its repository' do
      build.start!

      build.number.should_not be_nil
      build.repository.last_build_number.should == build.number
    end

    it 'denormalizes last_build_started_at to its repository' do
      build.start!

      build.started_at.should_not be_nil
      build.repository.last_build_started_at.should == build.started_at
    end
  end

  describe 'on build:finished' do
    it 'denormalizes last_build_status to its repository' do
      build.stubs(:matrix_finished?).returns(true)
      build.start!
      build.finish!(:status => 0)

      build.status.should_not be_nil
      build.repository.last_build_status.should == build.status
    end

    it 'denormalizes last_build_finished_at to its repository' do
      build.stubs(:matrix_finished?).returns(true)
      build.start!
      build.finish!(:status => 0)

      build.finished_at.should_not be_nil
      build.repository.last_build_finished_at.should == build.finished_at
    end
  end
end
