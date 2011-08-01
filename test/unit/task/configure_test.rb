require 'test_helper'

class TaskConfigureTest < ActiveSupport::TestCase
  attr_reader :now, :request

  def setup
    @now = Time.now.tap { |now| Time.stubs(:now).returns(now) }
    @request = Request.create!
  end

  test "start starts the task and propagates to the request" do
    configure = request.task
    configure.start!
    configure.reload
    request.reload

    assert configure.started?
    assert request.started?
  end

  test "finish finishes the task and configures the request" do
    config = { 'rvm' => '1.9.2' }
    configure = request.task
    configure.finish!(config)
    configure.reload
    request.reload

    assert configure.finished?
    assert_equal now, configure.finished_at

    assert request.configured?
    assert_equal config, request.config
  end
end

