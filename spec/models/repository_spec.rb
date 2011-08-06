require 'spec_helper'

describe Repository do
  # before do
  #   @repository_1 =
  #   @repository_2 = Factory(:repository, :name => 'gem-release', :owner_name => 'flooose')
  #   @build_4 = Factory(:build, :repository => repository_1, :number => '4', :status => 1, :branch => 'feature', :started_at => '2010-11-10 12:00:20', :finished_at => '2010-11-10 12:00:20')
  #   @build_1 = Factory(:build, :repository => repository_1.reload, :number => '1', :status => 0, :started_at => '2010-11-11 12:00:00', :finished_at => '2010-11-11 12:00:10')
  #   @build_2 = Factory(:build, :repository => repository_2.reload, :number => '2', :status => 1, :started_at => '2010-11-11 12:00:10', :finished_at => '2010-11-11 12:00:10')
  #   @build_3 = Factory(:build, :repository => repository_2.reload, :number => '3', :status => nil, :started_at => '2010-11-11 12:00:20')

  #   repository_1.reload
  #   repository_2.reload
  # end

  describe 'validates' do
    it 'uniqueness of :owner_name/:name' do
      existing = Factory(:repository)
      repository = Repository.new(existing.attributes)
      repository.should_not be_valid
      repository.errors['name'].should == ['has already been taken']
    end
  end

  describe 'class methods' do
    describe 'human_status_by' do
      let(:repository) { Factory(:repository) }

      it 'returns "stable" if the last finished build of the repository with the given name and owner_name has passed' do
        Factory(:build, :repository => repository, :state => 'finished', :status => 0)
        Repository.human_status_by(:name => 'minimal', :owner_name => 'svenfuchs').should == 'stable'
      end

      it 'returns "stable" if the last finished build (in the given branch) of the repository with the given name and owner_name has passed on the given branch' do
        Factory(:build, :repository => repository, :state => 'finished', :status => 0, :commit => Factory(:commit, :branch => 'feature'))
        Repository.human_status_by(:name => 'minimal', :owner_name => 'svenfuchs', :branch => 'feature').should == 'stable'
      end

      it 'returns "unstable" if the last finished build of the repository with the given name and owner_name has passed' do
        Factory(:build, :repository => repository, :state => 'finished', :status => 1)
        Repository.human_status_by(:name => 'minimal', :owner_name => 'svenfuchs').should == 'unstable'
      end

      it 'returns "unstable" if the last finished build (in the given branch) of the repository with the given name and owner_name has passed' do
        Factory(:build, :repository => repository, :state => 'finished', :status => 1, :commit => Factory(:commit, :branch => 'feature'))
        Repository.human_status_by(:name => 'minimal', :owner_name => 'svenfuchs', :branch => 'feature').should == 'unstable'
      end
    end

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
        end.should raise_exception(Travis::GitHubApi::ServiceHookError)
      end

      it 'raises an error when can not authorize with GitHub' do
        stub_request(:post, 'https://api.github.com/hub').to_return(:status => 401, :body => '{}', :headers => {})

        lambda do
          Repository.find_or_create_and_add_service_hook('svenfuchs', 'not-so-minimal', user)
        end.should raise_exception(Travis::GitHubApi::ServiceHookError)
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
      xit 'sorts the most repository with the most recent build to the top' do
        repository_1 = Factory.create(:repository, :name => 'repository_1')
        repository_2 = Factory.create(:repository, :name => 'repository_2')

        Factory(:build, :repository => repository_1, :started_at => '2010-11-11 12:00:00', :finished_at => '2010-11-11 12:00:10')
        Factory(:build, :repository => repository_1, :started_at => '2010-11-10 12:00:20', :finished_at => '2010-11-10 12:00:20')
        Factory(:build, :repository => repository_2, :started_at => '2010-11-11 12:00:10', :finished_at => '2010-11-11 12:00:10')
        Factory(:build, :repository => repository_2, :started_at => '2010-11-11 12:00:20')

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

  xit 'denormalizes last_build_id, last_build_number, last_build_status, last_build_started_at and last_build_finished_at' do
    attribute_names = %w(last_build_id last_build_number last_build_status last_build_started_at last_build_finished_at)
    attributes = repository_1.attributes.values_at(*attribute_names)
    assert_equal [build_1.id.to_s, '1', '0', '2010-11-11 12:00:00 UTC', '2010-11-11 12:00:10 UTC'], attributes.map(&:to_s)

    attributes = repository_2.attributes.values_at(*attribute_names)
    assert_equal [build_3.id.to_s, '3', '', '2010-11-11 12:00:20 UTC', ''], attributes.map(&:to_s)
  end

  xit 'does not denormalize matrix child builds' do
    child = Factory(:build, :repository => repository_1, :parent => build_1, :number => '1.1')
    repository_1.reload.last_build_number.should == '1'
  end
end

