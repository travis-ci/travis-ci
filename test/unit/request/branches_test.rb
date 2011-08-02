require 'test_helper'

class RequestBranchesTest < ActiveSupport::TestCase
  attr_reader :commit

  def setup
    @commit = Commit.new(:branch => 'master')
  end

  # approved? returning true

  test 'approved? returns true if there is no branches option' do
    assert Request.new(:commit => commit).approved?
  end

  test 'approved? returns true if the branch is included the branches option given as a string' do
    assert Request.new(:commit => commit, :config => { :branches => 'master, develop' }).approved?
  end

  test 'approved? returns true if the branch is included in the branches option given as an array' do
    assert Request.new(:commit => commit, :config => { :branches => ['master', 'develop'] }).approved?
  end

  test 'approved? returns true if the branch is included in the branches :only option given as a string' do
    assert Request.new(:commit => commit, :config => { :branches => { :only => { :branches => 'master, develop' } } }).approved?
  end

  test 'approved? returns true if the branch is included in the branches :only option given as an array' do
    assert Request.new(:commit => commit, :config => { :branches => { :only => ['master', 'develop'] } }).approved?
  end

  test 'approved? returns true if the branch is not included in the branches :except option given as a string' do
    assert Request.new(:commit => commit, :config => { :branches => { :except => ['github-pages', 'feature-*'] } }).approved?
  end

  test 'approved? returns true if the branch is not included in the branches :except option given as an array' do
    assert Request.new(:commit => commit, :config => { :branches => { :except => ['github-pages', 'feature-*'] } }).approved?
  end

  # approved? returning false

  test 'approved? returns false if the branch is not included the branches option given as a string' do
    assert Request.new(:commit => commit, :config => { :branches => 'master, develop' }).approved?
  end

  test 'approved? returns false if the branch is not included in the branches option given as an array' do
    assert Request.new(:commit => commit, :config => { :branches => ['master', 'develop'] }).approved?
  end

  test 'approved? returns false if the branch is not included in the branches :only option given as a string' do
    assert Request.new(:commit => commit, :config => { :branches => { :only => 'master, develop' } }).approved?
  end

  test 'approved? returns false if the branch is not included in the branches :only option given as an array' do
    assert Request.new(:commit => commit, :config => { :branches => { :only => ['master', 'develop'] } }).approved?
  end

  test 'approved? returns false if the branch is included in the branches :except option given as a string' do
    assert Request.new(:commit => commit, :config => { :branches => { :except => ['github-pages', 'feature-*'] } }).approved?
  end

  test 'approved? returns false if the branch is included in the branches :except option given as an array' do
    assert Request.new(:commit => commit, :config => { :branches => { :except => ['github-pages', 'feature-*'] } }).approved?
  end
end
