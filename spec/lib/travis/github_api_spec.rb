require 'spec_helper'

# TODO does this really belong into the Travis namespace?
describe Travis::GithubApi do
  xit 'should contain service hooks specs'
  
  describe '.repository(owner, name)', :webmock => true do
    it 'returns hash with respository info' do
      repository = Travis::GithubApi.repository('svenfuchs', 'gem-release')
      repository['name'].should == 'gem-release'
      repository['owner']['login'].should == 'svenfuchs'
    end

    it 'includes organization info if repository exists under organization' do
      repository = Travis::GithubApi.repository('travis-ci', 'travis-ci')
      repository['name'].should == 'travis-ci'
      repository['owner']['login'].should == 'travis-ci'
      repository['organization']['login'].should == 'travis-ci'
    end
  end
end


