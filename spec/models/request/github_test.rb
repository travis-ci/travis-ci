require 'spec_helper'

describe Request::Github do
  describe 'create_from_github_payload' do
    def create_request(name)
      Request.create_from_github_payload(GITHUB_PAYLOADS[name], 'travis-token')
    end

    describe 'find_or_create_repository' do
      let(:payload) { Github::ServiceHook::Payload.new(ActiveSupport::JSON.decode(GITHUB_PAYLOADS['gem-release'])) }

      it 'finds an existing repository' do
        repository = Factory(:repository, :owner_name => payload.repository.owner_name, :name => payload.repository.name)
        Request::Github.find_or_create_repository(payload.repository).id.should == repository.id
      end

      it 'creates a new repository' do
        repository = Request::Github.find_or_create_repository(payload.repository)
        repository.attributes.slice('name', 'owner_name').should == { 'owner_name' => 'svenfuchs', 'name' => 'gem-release' }
      end
    end

    it 'given a valid payload creates a request including its commit on the repository' do
      request = create_request('gem-release').reload
      repository = request.repository
      commit = request.commit

      request.payload.should == GITHUB_PAYLOADS['gem-release']

      commit.commit.should == '9854592'
      commit.message.should == 'Bump to 0.0.15'
      commit.branch.should == 'master'
      commit.committed_at.to_formatted_s.should == '2010-10-27 04:32:37 UTC'

      commit.committer_name.should == 'Sven Fuchs'
      commit.committer_email.should == 'svenfuchs@artweb-design.de'
      commit.author_name.should == 'Christopher Floess'
      commit.author_email.should == 'chris@flooose.de'

      repository.name.should == 'gem-release'
      repository.owner_name.should == 'svenfuchs'
      repository.owner_email.should == 'svenfuchs@artweb-design.de'
      repository.owner_name.should == 'svenfuchs'
      repository.url.should == 'http://github.com/svenfuchs/gem-release'
      # request.token.should == 'travis-token'
    end
  end
end
