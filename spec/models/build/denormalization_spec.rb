require 'spec_helper'

describe Build, 'denormalization' do
  let(:build) { Factory(:build) }

  describe 'on build:started' do
    before :each do
      build.matrix.each do |task|
        task.start!
      end
      build.reload
    end

    it 'denormalizes last_build_id to its repository' do
      build.reload.repository.last_build_id.should == build.id
    end

    it 'denormalizes last_build_number to its repository' do
      build.reload.repository.last_build_number.should == build.number
    end

    it 'denormalizes last_build_started_at to its repository' do
      build.reload.repository.last_build_started_at.should == build.started_at
    end
  end

  describe 'on build:finished' do
    before :each do
      build.matrix.each do |task|
        task.start!
        task.finish!(:status => 0)
      end
      build.reload
    end

    it 'denormalizes last_build_status to its repository' do
      build.repository.last_build_status.should == build.status
    end

    it 'denormalizes last_build_finished_at to its repository' do
      build.repository.last_build_finished_at.should == build.finished_at
    end
  end
end
