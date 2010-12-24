require 'test_helper_rails'

class ModelsRepositoryTest < Test::Unit::TestCase
  def setup
    super
    Factory(:build)
  end

  test 'Repository.timeline eager loads last_build' do
    assert Repository.timeline.first.last_build.loaded?
  end
end
