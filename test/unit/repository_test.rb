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

  test 'find_or_create_by_repository: finds an existing repository' do
    data    = ActiveSupport::JSON.decode(GITHUB_PAYLOADS['gem-release'])
    payload = Github::ServiceHook::Payload.new(data)

    assert_equal repository_1, Repository.find_or_create_by_repository(payload.repository)
  end

  test 'find_or_create_by_repository: creates a new repository' do
    repository_1.destroy
    data     = ActiveSupport::JSON.decode(GITHUB_PAYLOADS['gem-release'])
    payload  = Github::ServiceHook::Payload.new(data)

    attribute_names = ['name', 'owner_name', 'owner_email', 'url']
    expected = repository_1.attributes.slice(*attribute_names)
    actual   = Repository.find_or_create_by_repository(payload.repository).attributes.slice(*attribute_names)

    assert_equal expected, actual
  end

  test "find_and_remove_service_hook: finds an existing repo and removes a service hook" do
    stub_request(:post, "https://api.github.com/hub").
      to_return(:status => 200, :body => "", :headers => {})

    minimal = Factory.create(:repository)
    user    = Factory.create(:user)

    assert_no_difference('Repository.count') do
      with_hook = Repository.find_and_remove_service_hook('svenfuchs', 'minimal', user)

      assert with_hook.persisted?
      assert_equal with_hook.is_active, false
      assert_equal minimal, with_hook
    end
  end


  test "find_or_create_and_add_service_hook: finds an existing repo and adds a service hook" do
    stub_request(:post, "https://api.github.com/hub").
      to_return(:status => 200, :body => "", :headers => {})

    minimal = Factory.create(:repository)
    user    = Factory.create(:user)

    assert_no_difference('Repository.count') do
      with_hook = Repository.find_or_create_and_add_service_hook('svenfuchs', 'minimal', user)

      assert with_hook.persisted?
      assert_equal minimal, with_hook
    end
  end

  test "find_or_create_and_add_service_hook: creates a new repo and adds a service hook" do
    stub_request(:post, "https://api.github.com/hub").
      to_return(:status => 200, :body => "", :headers => {})

    user = Factory.create(:user)

    assert_difference('Repository.count', 1) do
      new_repo = Repository.find_or_create_and_add_service_hook('svenfuchs', 'not-so-minimal', user)

      assert new_repo.persisted?
    end
  end

  test "find_or_create_and_add_service_hook: raises an error if the service hook can't be added" do
    stub_request(:post, "https://api.github.com/hub").
      to_return(:status => 422, :body => '{ "message":"test message" }', :headers => {})

    user = Factory.create(:user)

    assert_raises(Travis::GitHubApi::ServiceHookError) do
      Repository.find_or_create_and_add_service_hook('svenfuchs', 'not-so-minimal', user)
    end
  end

  test "find_or_create_and_add_service_hook: raises an error when can't authorize with GitHub" do
    stub_request(:post, "https://api.github.com/hub").
      to_return(:status => 401, :body => '{ "message":"test message" }', :headers => {})

    user = Factory.create(:user)

    assert_raises(Travis::GitHubApi::ServiceHookError) do
      Repository.find_or_create_and_add_service_hook('svenfuchs', 'not-so-minimal', user)
    end
  end

  test "find_or_create_and_add_service_hook: raises an error if the record is invalid" do
    user = Factory.create(:user)

    assert_raises(ActiveRecord::RecordInvalid) do
      Repository.find_or_create_and_add_service_hook('svenfuchs', nil, user)
    end
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
