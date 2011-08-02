require 'test_helper'

class TaskTestTest < ActiveSupport::TestCase
  attr_reader :now, :build

  def setup
    @now = Time.now.tap { |now| Time.stubs(:now).returns(now) }
    @build = Factory(:build, :config => { :rvm => ['1.8.7', '1.9.2'] })
  end

  def task
    build.matrix.first
  end

  def tasks
    build.matrix
  end

  test "start starts the task and propagates to the build" do
    task.start!
    assert_state :started, task.reload
    assert_state :started, build.reload
  end

  test "finish finishes the task and, when all of the tasks are finished, the build" do
    tasks.first.start!
    tasks.first.finish!(0)

    assert_state :started, build.reload
    assert_state :finished, tasks.first

    tasks.second.finish!(0)
    assert_state :finished, build.reload
    assert_state :finished, tasks.second
    assert_equal 0, build.status
  end

  test "appends streamed build log chunks" do
    lines = [
      "$ git clone --depth=1000 --quiet git://github.com/intridea/omniauth.git ~/builds/intridea/omniauth\n",
      "$ git checkout -qf 662af2708525b776aac580b10cc903ba66050e06\n",
      "$ bundle install --pa"
    ]
    0.upto(2) do |ix|
      task.append_log!(lines[ix])
      task.reload
      assert_equal lines[0, ix + 1].join, task.log
    end
  end
end



