require 'spec_helper'

describe Request::Branches do
  describe :approve? do
    describe 'returns true' do
      let(:commit) { Commit.new(:branch => 'master') }

      it 'if there is no branches option' do
        Request.new(:commit => commit).approved?
      end

      it 'if the branch is included the branches option given as a string' do
        Request.new(:commit => commit, :config => { :branches => 'master, develop' }).should be_approved
      end

      it 'if the branch is included in the branches option given as an array' do
        Request.new(:commit => commit, :config => { :branches => ['master', 'develop'] }).should be_approved
      end

      it 'if the branch is included in the branches :only option given as a string' do
        Request.new(:commit => commit, :config => { :branches => { :only => 'master, develop' } }).should be_approved
      end

      it 'if the branch is included in the branches :only option given as an array' do
        Request.new(:commit => commit, :config => { :branches => { :only => ['master', 'develop'] } }).should be_approved
      end

      it 'if the branch is not included in the branches :except option given as a string' do
        Request.new(:commit => commit, :config => { :branches => { :except => 'github-pages, feature-*' } }).should be_approved
      end

      it 'if the branch is not included in the branches :except option given as an array' do
        Request.new(:commit => commit, :config => { :branches => { :except => ['github-pages', 'feature-*'] } }).should be_approved
      end
    end

    describe 'returns false' do
      let(:commit) { Commit.new(:branch => 'github-pages') }

      it 'if the branch is not included the branches option given as a string' do
        Request.new(:commit => commit, :config => { :branches => 'master, develop' }).should_not be_approved
      end

      it 'if the branch is not included in the branches option given as an array' do
        Request.new(:commit => commit, :config => { :branches => ['master', 'develop'] }).should_not be_approved
      end

      it 'if the branch is not included in the branches :only option given as a string' do
        Request.new(:commit => commit, :config => { :branches => { :only => 'master, develop' } }).should_not be_approved
      end

      it 'if the branch is not included in the branches :only option given as an array' do
        Request.new(:commit => commit, :config => { :branches => { :only => ['master', 'develop'] } }).should_not be_approved
      end

      it 'if the branch is included in the branches :except option given as a string' do
        Request.new(:commit => commit, :config => { :branches => { :except => 'github-pages, feature-*' } }).should_not be_approved
      end

      it 'if the branch is included in the branches :except option given as an array' do
        Request.new(:commit => commit, :config => { :branches => { :except => ['github-pages', 'feature-*'] } }).should_not be_approved
      end
    end
  end
end

