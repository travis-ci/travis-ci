require 'spec_helper'

describe Request::Github do
  include TestHelpers::GithubApi

  describe 'creation' do
    def create_request(name)
      Request.create_from_github_payload(GITHUB_PAYLOADS[name], 'travis-token')
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

    it 'given a payload for a gh_pages branch does not create a request' do
      lambda { create_request('gh-pages-update') }.should_not change(Request, :count)
    end

    it 'given a payload for a private repo does not create a request' do
      lambda { create_request('private-repo') }.should_not change(Request, :count)
    end

    it 'given a payload for a private repo returns false' do
      create_request('private-repo').should be_false
    end

    it 'given a payload containing no commit information does not create a request' do
      lambda { create_request('force-no-commit') }.should_not change(Request, :count)
    end
  end
end

