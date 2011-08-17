require 'test_helper'

class ModelsRepositoryTest < ActiveSupport::TestCase
  attr_reader :repository_1, :repository_2, :repository_3, :build_1, :build_2, :build_3, :build_4, :build_5

  def setup
    super
    @repository_1 = Factory(:repository, :name => 'gem-release', :owner_name => 'svenfuchs')
    @repository_2 = Factory(:repository, :name => 'gem-release', :owner_name => 'flooose')
    @build_4 = Factory(:build, :repository => repository_1, :number => '4', :status => 1, :branch => 'feature', :started_at => '2010-11-10 12:00:20', :finished_at => '2010-11-10 12:00:20')
    @build_1 = Factory(:build, :repository => repository_1.reload, :number => '1', :status => 0, :started_at => '2010-11-11 12:00:00', :finished_at => '2010-11-11 12:00:10')
    @build_2 = Factory(:build, :repository => repository_2.reload, :number => '2', :status => 1, :started_at => '2010-11-11 12:00:10', :finished_at => '2010-11-11 12:00:10')
    @build_3 = Factory(:build, :repository => repository_2.reload, :number => '3', :status => nil, :started_at => '2010-11-11 12:00:20')

    @repository_3 = Factory(:repository, :name => 'gem-release', :owner_name => 'joelmahoney')
    @build_5 = Factory(:build, :repository => repository_3, :number => '5', :status => 0, :started_at => '2010-11-11 12:00:05', :finished_at => '2010-11-11 12:00:10', :config => { 'rvm' => ['1.8.7', '1.9.2'], 'env' => ['DB=sqlite3', 'DB=postgresql'] })
    @repository_3.update_attribute(:last_build, @build_5)

    repository_1.reload
    repository_2.reload
    repository_3.reload
  end

  test 'returns stable human readable status for stable build' do
    assert_equal 'stable', repository_1.human_status
  end

  test 'returns unstable human readable status for unstable build' do
    assert_equal 'unstable', repository_2.human_status
  end

  test 'returns human readable status for branch' do
    assert_equal 'unstable', repository_1.human_status('feature')
  end

  test 'returns unknown human readable status for unfinished build' do
    assert_equal Factory(:repository).human_status, 'unknown'
  end

  test 'validates_uniqueness of :owner_name/:name' do
    repository = Repository.new(:name => 'gem-release', :owner_name => 'svenfuchs')
    assert !repository.valid?
    assert_equal ['has already been taken'], repository.errors['name']
  end

  test 'human_status_by: finds the human status of an existing repository with stable build' do
    assert_equal 'stable', Repository.human_status_by({:name => 'gem-release', :owner_name => 'svenfuchs'})
  end

  test 'human_status_by: finds the human status of an existing repository with unstable build' do
    assert_equal 'unstable', Repository.human_status_by({:name => 'gem-release', :owner_name => 'flooose'})
  end

  test 'human_status_by: finds the human status of an existing repository with a branch specified' do
    assert_equal 'unstable', Repository.human_status_by({:name => 'gem-release', :owner_name => 'svenfuchs', :branch => 'feature'})
  end

  test 'find_or_create_by_github_repository: finds an existing repository' do
    data    = ActiveSupport::JSON.decode(GITHUB_PAYLOADS['gem-release'])
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

  test "find_and_remove_service_hook: finds an existing repo and removes a service hook" do
    stub_request(:post, "https://api.github.com/hub").
      to_return(:status => 200, :body => "", :headers => {})

    minimal = FactoryGirl.create(:repository)
    user    = FactoryGirl.create(:user)

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

    minimal = FactoryGirl.create(:repository)
    user    = FactoryGirl.create(:user)

    assert_no_difference('Repository.count') do
      with_hook = Repository.find_or_create_and_add_service_hook('svenfuchs', 'minimal', user)

      assert with_hook.persisted?
      assert_equal minimal, with_hook
    end
  end

  test "find_or_create_and_add_service_hook: creates a new repo and adds a service hook" do
    stub_request(:post, "https://api.github.com/hub").
      to_return(:status => 200, :body => "", :headers => {})

    user = FactoryGirl.create(:user)

    assert_difference('Repository.count', 1) do
      new_repo = Repository.find_or_create_and_add_service_hook('svenfuchs', 'not-so-minimal', user)

      assert new_repo.persisted?
    end
  end

  test "find_or_create_and_add_service_hook: raises an error if the service hook can't be added" do
    stub_request(:post, "https://api.github.com/hub").
      to_return(:status => 422, :body => '{ "message":"test message" }', :headers => {})

    user = FactoryGirl.create(:user)

    assert_raises(Travis::GitHubApi::ServiceHookError) do
      Repository.find_or_create_and_add_service_hook('svenfuchs', 'not-so-minimal', user)
    end
  end

  test "find_or_create_and_add_service_hook: raises an error when can't authorize with GitHub" do
    stub_request(:post, "https://api.github.com/hub").
      to_return(:status => 401, :body => '{ "message":"test message" }', :headers => {})

    user = FactoryGirl.create(:user)

    assert_raises(Travis::GitHubApi::ServiceHookError) do
      Repository.find_or_create_and_add_service_hook('svenfuchs', 'not-so-minimal', user)
    end
  end

  test "find_or_create_and_add_service_hook: raises an error if the record is invalid" do
    user = FactoryGirl.create(:user)

    assert_raises(ActiveRecord::RecordInvalid) do
      Repository.find_or_create_and_add_service_hook('svenfuchs', nil, user)
    end
  end

  test "find_by_params should find a repository by it's id" do
    repository = FactoryGirl.create(:repository)
    assert_equal Repository.find_by_params(:id => repository.id), repository
  end

  test "find_by_params should find a repository by it's name and owner_name" do
    repository = FactoryGirl.create(:repository)
    assert_equal Repository.find_by_params(:name => repository.name, :owner_name => repository.owner_name), repository
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

  test '#last_finished_build with branch returns the most recent finished build on that branch' do
    assert_equal build_4, repository_1.last_finished_build('feature')
  end

  test 'denormalizes last_build_id, last_build_number, last_build_status, last_build_started_at and last_build_finished_at' do
    attribute_names = %w(last_build_id last_build_number last_build_status last_build_started_at last_build_finished_at)
    attributes = repository_1.attributes.values_at(*attribute_names)
    assert_equal [build_1.id.to_s, '1', '0', '2010-11-11 12:00:00 UTC', '2010-11-11 12:00:10 UTC'], attributes.map(&:to_s)

    attributes = repository_2.attributes.values_at(*attribute_names)
    assert_equal [build_3.id.to_s, '3', '', '2010-11-11 12:00:20 UTC', ''], attributes.map(&:to_s)
  end

  test 'does not denormalize matrix child builds' do
    child = Factory(:build, :repository => repository_1, :parent => build_1, :number => '1.1')
    assert_equal '1', repository_1.reload.last_build_number
  end

  test "validates last_build_status has not been overridden" do
    repository = Factory(:repository, :last_build => @build_5)
    repository.last_build_status_overridden = true
    assert_raises(ActiveRecord::RecordInvalid) do
      repository.save!
    end
  end

  test "override_last_build_status? returns false when last_build is nil" do
    repo = Factory(:repository, :last_build => nil)
    assert !repo.override_last_build_status?('rvm' => '1.8.7')
  end

  test "override_last_build_status? returns false when no matching keys" do
    assert !repository_3.override_last_build_status?({})
  end

  test "override_last_build_status? returns true with last_build and matching keys" do
    assert repository_3.override_last_build_status?('rvm' => '1.8.7')
  end

  test "override_last_build_status! sets last_build_status_overridden to true" do
    repository_3.override_last_build_status!({})
    assert repository_3.last_build_status_overridden
  end

  test "override_last_build_status! sets last_build_status nil when hash is empty" do
    repository_3.override_last_build_status!({})
    assert_equal nil, repository_3.last_build_status
  end

  test "override_last_build_status! sets last_build_status nil when hash is invalid" do
    repository_3.override_last_build_status!({'foo' => 'bar'})
    assert_equal nil, repository_3.last_build_status
  end

  test "override_last_build_status! sets last_build_status to 0 (passing) when all specified builds are passing" do
    build_5.matrix.each do |build|
      build.update_attribute(:status, 0) if build.config['rvm'] == '1.8.7'
      build.update_attribute(:status, 1) if build.config['rvm'] == '1.9.2'
    end
    repository_3.override_last_build_status!({'rvm' => '1.8.7'})
    assert_equal 0, repository_3.last_build_status
  end

  test "override_last_build_status! sets last_build_status to 1 (failing) when at least one specified build is failing" do
    build_5.matrix.each do |build|
      build.update_attribute(:status, 0)
    end
    build_5.matrix[0].update_attribute(:status, 1)
    repository_3.override_last_build_status!({'rvm' => '1.8.7'})
    assert_equal 1, repository_3.last_build_status
  end

end
