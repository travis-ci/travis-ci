require 'test_helper'

class BuildMailerHelperTest < ActionView::TestCase
  attr_reader :build
  
  def setup
    @build = Factory(:successful_build)
  end

  test "#title returns title for the build" do
    assert_equal "Build Update for svenfuchs/minimal", title(build)
  end
end
