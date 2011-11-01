require 'spec_helper'
require 'support/active_record'

describe Build, 'denormalization' do
  include Support::ActiveRecord

  let(:build) { Factory(:build) }

  describe 'on build:started' do
    before :each do
      build.denormalize(:start)
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
      build.denormalize(:finish, :status => 0)
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

