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
      let(:user)    { Factory.create(:user) }

      it 'finds an existing repo and removes a service hook' do
        stub_request(:post, 'https://api.github.com/hub').to_return(:status => 200, :body => '', :headers => {})
        minimal = Factory.create(:repository)

        lambda do
          repository = Repository.find_and_remove_service_hook('svenfuchs', 'minimal', user)
          repository.should be_persisted
          repository.should_not be_active
          repository.id.should == minimal.id
        end.should_not change(Repository, :count)
      end
    end

    describe 'find_or_create_and_add_service_hook' do
      let(:user)    { Factory.create(:user) }

      it 'finds an existing repo and adds a service hook' do
        stub_request(:post, 'https://api.github.com/hub').to_return(:status => 200, :body => '', :headers => {})
        minimal = Factory.create(:repository)

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
      let(:minimal) { Factory.create(:repository) }

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
        repository_1 = Factory.create(:repository, :name => 'repository_1', :last_build_started_at => '2011-11-11')
        repository_2 = Factory.create(:repository, :name => 'repository_2', :last_build_started_at => '2011-11-12')

        repositories = Repository.timeline.all
        repositories.first.id.should == repository_2.id
        repositories.last.id.should == repository_1.id
      end
    end
  end

  describe 'human_status' do
    let(:repository) { Factory(:repository) }

    it 'returns "stable" if the last finished build has passed' do
      Factory(:build, :repository => repository, :state => 'finished', :status => 0)
      repository.human_status.should == 'stable'
    end

    it 'returns "stable" if the last finished build in a given branch has passed' do
      Factory(:build, :repository => repository, :state => 'finished', :status => 0, :commit => Factory(:commit, :branch => 'feature'))
      repository.human_status('feature').should == 'stable'
    end

    it 'returns "unstable" if the last finished build has failed' do
      Factory(:build, :repository => repository, :state => 'finished', :status => 1)
      repository.human_status.should == 'unstable'
    end

    it 'returns "unstable" if the last finished build in a given branch has not passed' do
      Factory(:build, :repository => repository, :state => 'finished', :status => 1, :commit => Factory(:commit, :branch => 'feature'))
      repository.human_status('feature').should == 'unstable'
    end

    it 'returns "unknown" if there is no finished build' do
      Factory(:build, :repository => repository, :state => 'started')
      repository.human_status.should == 'unknown'
    end
  end

  it 'last_build returns the most recent build' do
    repository = Factory.create(:repository)
    attributes = { :repository => repository, :state => 'finished' }
    Factory(:build, attributes)
    Factory(:build, attributes)
    build = Factory(:build, attributes)

    repository.last_build.id.should == build.id
  end

  it 'last_finished_build returns the most recent finished build' do
    repository = Factory.create(:repository)
    Factory(:build, :repository => repository, :state => 'finished')
    build = Factory(:build, :repository => repository, :state => 'finished')
    Factory(:build, :repository => repository, :state => 'started')

    repository.last_finished_build.id.should == build.id
  end

  it 'last_finished_build with branch returns the most recent finished build on that branch' do
    repository = Factory.create(:repository)
    build = Factory(:build, :repository => repository, :state => 'finished', :commit => Factory(:commit, :branch => 'feature'))
    Factory(:build, :repository => repository, :state => 'finished', :commit => Factory(:commit, :branch => 'master'))
    Factory(:build, :repository => repository, :state => 'started', :commit => Factory(:commit, :branch => 'feature'))

    repository.last_finished_build('feature').id.should == build.id
  end
end

