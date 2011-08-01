require 'test_helper'

class BuildTaskConfigureTest < ActiveSupport::TestCase
  attr_reader :now, :build

  def setup
    @now = Time.now.tap { |now| Time.stubs(:now).returns(now) }
    @build = Build.create!
    # App.register_observer(build)
  end

  test "start starts the task and propagates to the build" do
    configure = build.tasks.first
    configure.start!
    configure.reload
    build.reload

    assert configure.reload.started?
    assert build.reload.started?
  end

  test "finish finishes the task and configures the build " do
    config = { 'rvm' => '1.9.2' }
    configure = build.tasks.first
    configure.finish!(config)
    configure.reload
    build.reload

    assert configure.finished?
    assert_equal now, configure.finished_at

    assert build.configured?
    assert_equal config, build.config
    # assert_equal [:foo, :bar], build.matrix
  end

  # test "build finish" do
  #   build.state = :configured
  #   build.matrix.each do |task|
  #     task.state = :started
  #     task.finish(:result => 0)

  #     assert task.finished?
  #     assert_equal 0, task.result
  #   end

  #   assert build.finished?
  #   assert_equal now, build.finished_at
  # end
end


