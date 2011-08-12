require 'spec_helper'

describe Repository do
  describe 'validates' do
    it 'uniqueness of :owner_name/:name' do
      existing = Factory(:repository)
      repository = Repository.new(existing.attributes)
      repository.should_not be_valid
      repository.errors['name'].should == ['has already been taken']
    end
  end

  describe 'class methods' do
    describe 'find_or_create_by_github_repository' do
      let(:payload) { Github::ServiceHook::Payload.new(ActiveSupport::JSON.decode(GITHUB_PAYLOADS['gem-release'])) }

      it 'finds an existing repository' do
        repository = Factory(:repository, :owner_name => payload.repository.owner_name, :name => payload.repository.name)
        Repository.find_or_create_by_github_repository(payload.repository).id.should == repository.id
      end

      it 'creates a new repository' do
        repository = Repository.find_or_create_by_github_repository(payload.repository)
        repository.attributes.slice('name', 'owner_name').should == { 'owner_name' => 'svenfuchs', 'name' => 'gem-release' }
      end
    end

    describe 'find_and_remove_service_hook' do
      let(:user) { Factory(:user) }

      it 'finds an existing repo and removes a service hook' do
        stub_request(:post, 'https://api.github.com/hub').to_return(:status => 200, :body => '', :headers => {})
        minimal = Factory(:repository)

        lambda do
          repository = Repository.find_and_remove_service_hook('svenfuchs', 'minimal', user)
          repository.should be_persisted
          repository.should_not be_active
          repository.id.should == minimal.id
        end.should_not change(Repository, :count)
      end
    end

    describe 'find_or_create_and_add_service_hook' do
      let(:user) { Factory(:user) }

      it 'finds an existing repo and adds a service hook' do
        stub_request(:post, 'https://api.github.com/hub').to_return(:status => 200, :body => '', :headers => {})
        minimal = Factory(:repository)

        lambda do
          repository = Repository.find_or_create_and_add_service_hook('svenfuchs', 'minimal', user)
          repository.should be_persisted
          repository.should be_active
          repository.id.should == minimal.id
        end.should_not change(Repository, :count)
      end

      it 'creates a new repo and adds a service hook' do
        stub_request(:post, 'https://api.github.com/hub').to_return(:status => 200, :body => '', :headers => {})

        lambda do
          repository = Repository.find_or_create_and_add_service_hook('svenfuchs', 'not-so-minimal', user)
          repository.should be_persisted
          repository.should be_active
        end.should change(Repository, :count).by(1)
      end

      it 'raises an error if the service hook can not be added' do
        stub_request(:post, 'https://api.github.com/hub').to_return(:status => 422, :body => '{}', :headers => {})

        lambda do
          Repository.find_or_create_and_add_service_hook('svenfuchs', 'not-so-minimal', user)
        end.should raise_exception(Travis::GithubApi::ServiceHookError)
      end

      it 'raises an error when can not authorize with GitHub' do
        stub_request(:post, 'https://api.github.com/hub').to_return(:status => 401, :body => '{}', :headers => {})

        lambda do
          Repository.find_or_create_and_add_service_hook('svenfuchs', 'not-so-minimal', user)
        end.should raise_exception(Travis::GithubApi::ServiceHookError)
      end

      it 'raises an error if the record is invalid' do
        assert_raises(ActiveRecord::RecordInvalid) do
          Repository.find_or_create_and_add_service_hook('svenfuchs', nil, user)
        end
      end
    end

    describe 'find_by_params' do
      let(:minimal) { Factory(:repository) }

      it "should find a repository by it's id" do
        Repository.find_by_params(:id => minimal.id).id.should == minimal.id
      end

      it "should find a repository by it's name and owner_name" do
        repository = Repository.find_by_params(:name => minimal.name, :owner_name => minimal.owner_name)
        repository.owner_name.should == minimal.owner_name
        repository.name.should == minimal.name
      end
    end

    describe 'timeline' do
      it 'sorts the most repository with the most recent build to the top' do
        repository_1 = Factory(:repository, :name => 'repository_1', :last_build_started_at => '2011-11-11')
        repository_2 = Factory(:repository, :name => 'repository_2', :last_build_started_at => '2011-11-12')

        repositories = Repository.timeline.all
        repositories.first.id.should == repository_2.id
        repositories.last.id.should == repository_1.id
      end
    end
  end

  describe 'last_finished_build_status_name' do
    let(:repository) { Factory(:repository) }
    let(:build)      { Factory(:build, :repository => repository) }

    it 'returns "passing" if the last finished build has passed' do
      build.stubs(:matrix_finished?).returns(true)
      build.finish!(:status => 0)
      repository.reload.last_finished_build_status_name.should == 'passing'
    end

    it 'returns "failing" if the last finished build has failed' do
      build.stubs(:matrix_finished?).returns(true)
      build.finish!(:status => 1)
      repository.reload.last_finished_build_status_name.should == 'failing'
    end

    it 'returns "unknown" if there is no finished build' do
      repository.reload.last_finished_build_status_name.should == 'unknown'
    end

    # it 'returns "unstable" if the last finished build in a given branch has not passed' do
    #   Factory(:build, :repository => repository, :state => 'finished', :status => 1, :commit => Factory(:commit, :branch => 'feature'))
    #   repository.last_finished_build_status_name('feature').should == 'unstable'
    # end

    # it 'returns "stable" if the last finished build in a given branch has passed' do
    #   Factory(:build, :repository => repository, :state => 'finished', :status => 0, :commit => Factory(:commit, :branch => 'feature'))
    #   repository.last_finished_build_status_name('feature').should == 'stable'
    # end
  end

  it 'last_build returns the most recent build' do
    repository = Factory(:repository)
    attributes = { :repository => repository, :state => 'finished' }
    Factory(:build, attributes)
    Factory(:build, attributes)
    build = Factory(:build, attributes)

    repository.last_build.id.should == build.id
  end

  it 'validates last_build_status has not been overridden' do
    repository = Factory(:repository)
    repository.last_build_status_overridden = true
    assert_raises(ActiveRecord::RecordInvalid) do
      repository.save!
    end
  end

  describe 'override_last_finished_build_status!' do
    let(:repository) { Factory(:build, :state => 'finished', :config => { 'rvm' => ['1.8.7', '1.9.2'], 'env' => ['DB=sqlite3', 'DB=postgresql'] }).repository }

    it 'sets last_build_status_overridden to true' do
      repository.override_last_finished_build_status!('rvm' => '1.8.7')
      assert repository.last_build_status_overridden
    end

    it 'sets last_build_status nil when hash is empty' do
      repository.override_last_finished_build_status!({})
      assert_equal nil, repository.last_build_status
    end

    it 'sets last_build_status nil when hash is invalid' do
      repository.override_last_finished_build_status!('foo' => 'bar')
      assert_equal nil, repository.last_build_status
    end

    it 'sets last_build_status to 0 (passing) when all specified builds are passing' do
      repository.builds.first.matrix.each do |task|
        task.update_attribute(:status, task.config[:rvm] == '1.8.7' ? 0 : 1)
      end
      repository.override_last_finished_build_status!('rvm' => '1.8.7')
      assert_equal 0, repository.last_build_status
    end

    it 'sets last_build_status to 1 (failing) when at least one specified build is failing' do
      repository.builds.first.matrix.each_with_index do |build, ix|
        build.update_attribute(:status, ix == 0 ? 1 : 0)
      end
      repository.override_last_finished_build_status!('rvm' => '1.8.7')
      assert_equal 1, repository.last_build_status
    end
  end
end

