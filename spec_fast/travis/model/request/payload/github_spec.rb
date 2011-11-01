require 'spec_helper'

describe Request::Payload::Github do
  let(:payload) { Request::Payload::Github.new(GITHUB_PAYLOADS['gem-release'], 'token') }

  describe 'reject?' do
    it 'is true when the does not contain any commit information' do
      payload.stubs(:no_commit?).returns(true)
      payload.reject?.should be_true
    end

    it 'is true when the repository is private' do
      payload.repository.stubs(:private?).returns(true)
      payload.reject?.should be_true
    end

    it 'is true when the commit is skipped' do
      payload.stubs(:skipped?).returns(true)
      payload.reject?.should be_true
    end

    it 'is true when the branch is a github pages branch' do
      payload.stubs(:github_pages?).returns(true)
      payload.reject?.should be_true
    end
  end

  describe 'no_commit?' do
    it 'returns false when the payload contains a commit hash' do
      payload.commits.last.stubs(:commit).returns('1234567')
      payload.send(:no_commit?).should be_false
    end

    it 'returns true when the payload does not contain a commit hash' do
      payload.commits.last.stubs(:commit).returns(nil)
      payload.send(:no_commit?).should be_true
    end
  end

  describe 'skipped?' do
    it 'returns true when the commit message contains [ci skip]' do
      payload.last_commit.message = 'lets party like its 1999 [ci skip]'
      payload.send(:skipped?).should be_true
    end

    it 'returns true when the commit message contains [CI skip]' do
      payload.last_commit.message = 'lets party like its 1999 [CI skip]'
      payload.send(:skipped?).should be_true
    end

    it 'returns true when the commit message contains [ci:skip]' do
      payload.last_commit.message = 'lets party like its 1999 [ci:skip]'
      payload.send(:skipped?).should be_true
    end

    it 'returns false when the commit message contains [ci unknown-command]' do
      payload.last_commit.message = 'lets party like its 1999 [ci unknown-command]'
      payload.send(:skipped?).should be_false
    end
  end

  describe 'github_pages?' do
    it 'returns true for a branch named gh-pages' do
      payload.last_commit.ref = 'refs/heads/gh-pages'
      payload.send(:github_pages?).should be_true
    end

    it 'returns true for a branch named gh_pages' do
      payload.last_commit.ref = 'refs/heads/gh_pages'
      payload.send(:github_pages?).should be_true
    end

    it 'returns false for a branch named master' do
      payload.last_commit.ref = 'refs/heads/master'
      payload.send(:github_pages?).should be_false
    end
  end
end


