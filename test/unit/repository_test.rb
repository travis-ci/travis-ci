require 'test_helper'

class ModelsRepositoryTest < ActiveSupport::TestCase
  attr_reader :repository_0, :repository_1, :repository_2, :repository_3, :build_0, :build_1, :build_2, :build_3, :build_4

  def setup
    super
    @repository_0 = Factory(:repository, :name => 'gem-release', :owner_name => 'sferik')
    @repository_1 = Factory(:repository, :name => 'gem-release', :owner_name => 'svenfuchs')
    @repository_2 = Factory(:repository, :name => 'gem-release', :owner_name => 'flooose')
    @repository_3 = Factory(:repository, :name => 'gem-release', :owner_name => 'joelmahoney')

    @build_0 = Factory(:build, :repository => repository_1.reload, :number => '0', :status => 1, :branch => 'feature', :started_at => '2010-11-10 12:00:20', :finished_at => '2010-11-10 12:00:20')
    @build_1 = Factory(:build, :repository => repository_1.reload, :number => '1', :status => 0, :started_at => '2010-11-11 12:00:00', :finished_at => '2010-11-11 12:00:10')
    @build_2 = Factory(:build, :repository => repository_0.reload, :number => '2', :status => 1, :started_at => '2010-11-11 12:00:10', :finished_at => '2010-11-11 12:00:10')
    @build_3 = Factory(:build, :repository => repository_2.reload, :number => '3', :status => nil, :started_at => '2010-11-11 12:00:20')
    @build_4 = Factory(:development_branch_build, :repository => repository_3.reload, :number => '4', :status => 0, :started_at => '2010-11-11 12:00:05', :finished_at => '2010-11-11 12:00:10', :config => { 'rvm' => ['1.8.7', '1.9.2'], 'env' => ['DB=sqlite3', 'DB=postgresql'] })

    repository_0.reload
    repository_1.reload
    repository_2.reload
    repository_3.reload
  end

  test 'returns passing human readable status for passing build' do
    assert_equal 'passing', repository_1.last_finished_build_status_name
  end

  test 'returns failing human readable status for failing build' do
    assert_equal 'failing', repository_0.last_finished_build_status_name
  end

  test 'returns unknown human readable status for unfinished build' do
    assert_equal 'unknown', repository_2.last_finished_build_status_name
  end

  test 'validates_uniqueness of :owner_name/:name' do
    repository = Repository.new(:name => 'gem-release', :owner_name => 'svenfuchs')
    assert !repository.valid?
    assert_equal ['has already been taken'], repository.errors['name']
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
    assert_equal build_1, repository_1.last_finished_build
  end

  test '#last_finished_build with branch returns the most recent finished build on that branch' do
    assert_equal build_0, repository_1.last_finished_build({'branch' => 'feature'})
  end

  test 'denormalizes last_build_id, last_build_number, last_build_status, last_build_started_at and last_build_finished_at' do
    attribute_names = %w(last_build_id last_build_number last_build_status last_build_started_at last_build_finished_at)
    attributes = repository_1.attributes.values_at(*attribute_names)
    assert_equal [build_1.id.to_s, '1', '0', '2010-11-11 12:00:00 UTC', '2010-11-11 12:00:10 UTC'], attributes.map(&:to_s)

    attributes = repository_2.attributes.values_at(*attribute_names)
    assert_equal [build_3.id.to_s, '3', '', '2010-11-11 12:00:20 UTC', '2010-11-11 12:05:20 UTC'], attributes.map(&:to_s)
  end

  test 'does not denormalize matrix child builds' do
    child = Factory(:build, :repository => repository_1, :parent => build_1, :number => '1.1')
    assert_equal '1', repository_1.reload.last_build_number
  end

  test "validates last_build_status has not been overridden" do
    repository = Factory(:repository, :last_build => @build_4)
    repository.last_build_status_overridden = true
    assert_raises(ActiveRecord::RecordInvalid) do
      repository.save!
    end
  end

  test "override_last_finished_build_status! sets last_build_status_overridden to true" do
    repository_3.override_last_finished_build_status!({})
    assert repository_3.last_build_status_overridden
  end

  test "override_last_finished_build_status! leaves last_build_status unchanged when hash is empty" do
    repository_3.override_last_finished_build_status!({})
    assert_equal 0, repository_3.last_build_status
  end

  test "override_last_finished_build_status! should ignore an invalid hash" do
    repository_3.override_last_finished_build_status!({'foo' => 'bar'})
    assert_equal 0, repository_3.last_build_status
  end

  test "override_last_finished_build_status! sets last_build_status to 0 (passing) when all specified builds are passing" do
    build_4.matrix.each do |build|
      build.update_attribute(:status, 0) if build.config['rvm'] == '1.8.7'
      build.update_attribute(:status, 1) if build.config['rvm'] == '1.9.2'
    end
    repository_3.override_last_finished_build_status!({'rvm' => '1.8.7'})
    assert_equal 0, repository_3.last_build_status
  end

  test "override_last_finished_build_status! sets last_build_status to 1 (failing) when at least one specified build is failing" do
    build_4.matrix.each do |build|
      build.update_attribute(:status, 0)
    end
    build_4.matrix[0].update_attribute(:status, 1)
    repository_3.override_last_finished_build_status!({'rvm' => '1.8.7'})
    assert_equal 1, repository_3.last_build_status
  end

  test "override_last_finished_build_status! sets last_build_status to 0 (passing) when the branch is matching" do
    repository_3.override_last_finished_build_status!({'branch' => 'development'})
    assert_equal 0, repository_3.last_build_status
  end

end
