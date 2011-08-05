require 'test_helper'

describe "BuildEvents", ActiveSupport::TestCase do
  it "denormalize_to_repository denormalizes the build id, number and started_at attributes to the build's repository" do
    build = Factory(:build)
    now = Time.current
    build.update_attributes!(:number => 1, :started_at => now)
    repository = build.repository.reload

    repository.last_build_id.should == build.id
    repository.last_build_number.should == build.number.to_s
    repository.last_build_started_at.to_s.should == now.to_s
  end

  it "denormalize_to_repository denormalizes the build status and finished_at attributes to the build's repository if this is not a matrix build" do
    build = Factory(:build)
    now = Time.current
    build.update_attributes!(:finished_at => now, :status => 0)
    repository = build.repository.reload

    repository.last_build_status.should == 0
    repository.last_build_finished_at.to_s.should == now.to_s
  end

  it "denormalize_to_repository denormalizes the build status and finished_at attributes to the build's repository if this is a matrix build and all children have finished" do
    now = Time.now
    build = Factory(:build, :matrix => [Factory(:build), Factory(:build)], :config => { 'rvm' => ['1.8.7', '1.9.2'] })

    build.matrix.first.update_attributes!(:finished_at => now, :status => 0)
    build.matrix.last.update_attributes!(:finished_at => now, :status => 0)
    repository = build.repository.reload

    repository.last_build_status.should == 0
    repository.last_build_finished_at.should == now
  end
end
