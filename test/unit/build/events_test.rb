require 'test_helper'

class BuildEventsTest < ActiveSupport::TestCase
  attr_reader :repository

  def setup
    @repository = Factory(:repository)
  end

  test "denormalize_to_repository denormalizes the build id, number and started_at attributes to the build's repository" do
    build = Factory(:build, :repository => repository)
    now = Time.current
    build.update_attributes!(:number => 1, :started_at => now)
    repository = build.repository.reload

    assert_equal build.id, repository.last_build_id
    assert_equal build.number.to_s, repository.last_build_number
    assert_equal now.to_s, repository.last_build_started_at.to_s
  end

  test "denormalize_to_repository denormalizes the build status and finished_at attributes to the build's repository if this is not a matrix build" do
    build = Factory(:build, :repository => repository)
    now = Time.current
    build.update_attributes!(:finished_at => now, :status => 0)
    repository = build.repository.reload

    assert_equal 0, repository.last_build_status
    assert_equal now.to_s, repository.last_build_finished_at.to_s
  end

  test "denormalize_to_repository denormalizes the build status and finished_at attributes to the build's repository if this is a matrix build and all children have finished" do
    build = Factory(:build, :repository => repository, :matrix => [Factory(:build, :repository => repository), Factory(:build, :repository => repository)], :config => { 'rvm' => ['1.8.7', '1.9.2'] })
    june = Time.utc(2011, 06, 23, 20, 20, 20)
    build.matrix.first.update_attributes!(:finished_at => june, :status => 0)
    build.matrix.last.update_attributes!(:finished_at => june, :status => 0)
    repository = build.repository.reload

    assert_equal 0, repository.last_build_status
    assert_equal june, repository.last_build_finished_at
  end
end
