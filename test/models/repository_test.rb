require 'test_helper_rails'

class ModelsRepositoryTest < Test::Unit::TestCase
  attr_reader :repository_1, :repository_2, :build_1, :build_2, :build_3

  def setup
    super
    @repository_1 = Factory(:repository, :name => '1')
    @repository_2 = Factory(:repository, :name => '2')
    @build_1 = Factory(:build, :repository => repository_1, :started_at => '2010-11-11 12:00:00')
    @build_2 = Factory(:build, :repository => repository_2, :started_at => '2010-11-11 12:00:10')
    @build_3 = Factory(:build, :repository => repository_2, :started_at => '2010-11-11 12:00:20')
  end

  test 'Repository.timeline eager loads last_build' do
    assert Repository.timeline.first.last_build.loaded?
  end

  test 'Repository.timeline sorts the most repository with the most recent build to the top' do
    repositories = Repository.timeline.all
    assert_equal repository_2, repositories.first
    assert_equal repository_1, repositories.last
  end

  test 'repository.last_build returns the most recent build' do
    assert_equal build_3, repository_2.last_build
  end
end
