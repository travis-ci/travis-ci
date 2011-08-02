require 'test_helper'

class TaskConfigureTest < ActiveSupport::TestCase
  attr_reader :now, :request

  def setup
    @now = Time.now.tap { |now| Time.stubs(:now).returns(now) }
    @request = Factory(:request)
  end

  def task
    request.task
  end

  test "start starts the task and propagates to the request" do
    task.start!

    assert_state :started, request.reload
    assert_state :started, task.reload
  end

  test "finish finishes the task and configures the request" do
    config = { :rvm => ['1.8.7', '1.9.2'] }
    task.finish!(config)

    assert_state :finished, request.reload
    assert_equal config, request.config

    assert_state :finished, task
    assert_equal now, task.finished_at
  end
end
