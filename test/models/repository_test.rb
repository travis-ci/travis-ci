require 'test_helper_rails'

class ModelsRepositoryTest < Test::Unit::TestCase
  def setup
    Factory(:build)
    super
  end

  test 'Repository.timeline eager loads last_build' do
    assert Repository.timeline.first.last_build.loaded?
  end

  test 'repository.last_build returns the latest build' do
  end

  test 'repository.last_success returns the last successful build' do
  end

  test 'repository.last_failure returns the last failed build' do
  end

  test 'repository.name is populated from github uri' do
  end

  test 'repository.as_json returns a json hash suitable for the frontend app' do
  end
end
