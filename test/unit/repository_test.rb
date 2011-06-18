require 'test_helper'

class ModelsRepositoryTest < ActiveSupport::TestCase
  attr_reader :repository_1, :repository_2, :build_1, :build_2, :build_3

  def setup
    super
    @repository_1 = Factory(:repository, :name => 'gem-release', :owner_name => 'svenfuchs')
    @repository_2 = Factory(:repository, :name => 'gem-release', :owner_name => 'flooose')
    @build_1 = Factory(:build, :repository => repository_1, :number => '1', :status => 0, :started_at => '2010-11-11 12:00:00')
    @build_2 = Factory(:build, :repository => repository_2.reload, :number => '2', :status => 1, :started_at => '2010-11-11 12:00:10', :finished_at => '2010-11-11 12:00:10')
    @build_3 = Factory(:build, :repository => repository_2.reload, :number => '3', :status => nil, :started_at => '2010-11-11 12:00:20')

    repository_1.reload
    repository_2.reload
  end

  test 'validates_uniqueness of :owner_name/:name' do
    repository = Repository.new(:name => 'gem-release', :owner_name => 'svenfuchs')
    assert !repository.valid?
    assert_equal ['has already been taken'], repository.errors['name']
  end

  test 'find_or_create_by_github_repository: finds an existing repository' do
    data = ActiveSupport::JSON.decode(GITHUB_PAYLOADS['gem-release'])
    payload = Github::ServiceHook::Payload.new(data)
    assert_equal repository_1, Repository.find_or_create_by_github_repository(payload.repository)
  end

  test 'find_or_create_by_github_repository: creates a new repository' do
    repository_1.destroy
    data     = ActiveSupport::JSON.decode(GITHUB_PAYLOADS['gem-release'])
    payload  = Github::ServiceHook::Payload.new(data)

    attribute_names = ['name', 'owner_name', 'owner_email', 'url']
    expected = repository_1.attributes.slice(*attribute_names)
    actual   = Repository.find_or_create_by_github_repository(payload.repository).attributes.slice(*attribute_names)
    assert_equal expected, actual
  end

  test '.timeline sorts the most repository with the most recent build to the top' do
    repositories = Repository.timeline.all
    assert_equal repository_2, repositories.first
    assert_equal repository_1, repositories.last
  end

  test '#last_build returns the most recent build' do
    assert_equal build_3, repository_2.last_build
  end

  test '#last_finished_build returns the most recent finished build' do
    assert_equal build_2, repository_2.last_finished_build
  end

  test 'denormalizes last_build_id, last_build_number, last_build_status, last_build_started_at and last_build_finished_at' do
    attribute_names = %w(last_build_id last_build_number last_build_status last_build_started_at last_build_finished_at)
    attributes = repository_1.attributes.values_at(*attribute_names)
    assert_equal [build_1.id.to_s, '1', '0', '2010-11-11 12:00:00 UTC', ''], attributes.map(&:to_s)

    attributes = repository_2.attributes.values_at(*attribute_names)
    assert_equal [build_3.id.to_s, '3', '', '2010-11-11 12:00:20 UTC', ''], attributes.map(&:to_s)
  end

  test 'does not denormalize matrix child builds' do
    child = Factory(:build, :repository => repository_1, :parent => build_1, :number => '1.1')
    assert_equal '1', repository_1.reload.last_build_number
  end
end
