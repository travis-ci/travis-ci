require 'test_helper'

class RequestTest < ActiveSupport::TestCase
  test "it has a configure task" do
    assert Request.create!.reload.task.is_a?(Task::Configure)
  end
end
