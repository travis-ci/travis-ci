require 'test_helper'

class BuildTaskTestTest < ActiveSupport::TestCase
  attr_reader :now, :build

  def setup
    @now = Time.now.tap { |now| Time.stubs(:now).returns(now) }
    @build = Build.create!
    build.configure(:rvm => '1.9.2')
    # App.register_observer(build)
  end

  test "start starts the task and propagates to the build" do
    p build
  end

  test "finish finishes the task and configures the build" do
    # config = { 'rvm' => '1.9.2' }
    # configure = build.tasks.first
    # configure.finish!(config)
    # configure.reload
    # build.reload

    # assert configure.finished?
    # assert_equal now, configure.finished_at

    # assert build.configured?
    # assert_equal config, build.config
  end
end



