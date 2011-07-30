require 'test_helper'

class BuildBranchesTest < ActiveSupport::TestCase
  #
  # build? returning true

  test 'build? returns true if there is no branches option' do
    assert Build.new(:branch => 'master').build?
  end

  test 'build returns true if the branch is included the branches option given as a string' do
    assert Build.new(:branch => 'master', :config => { 'branches' => 'master, develop' }).build?
  end

  test 'build returns true if the branch is included in the branches option given as an array' do
    assert Build.new(:branch => 'master', :config => { 'branches' => ['master', 'develop'] }).build?
  end

  test 'build returns true if the branch is included in the branches :only option given as a string' do
    assert Build.new(:branch => 'master', :config => { 'branches' => { 'only' => { 'branches' => 'master, develop' } } }).build?
  end

  test 'build returns true if the branch is included in the branches :only option given as an array' do
    assert Build.new(:branch => 'master', :config => { 'branches' => { 'only' => ['master', 'develop'] } }).build?
  end

  test 'build returns true if the branch is not included in the branches :except option given as a string' do
    assert Build.new(:branch => 'master', :config => { 'branches' => { 'except' => ['github-pages', 'feature-*'] } }).build?
  end

  test 'build returns true if the branch is not included in the branches :except option given as an array' do
    assert Build.new(:branch => 'master', :config => { 'branches' => { 'except' => ['github-pages', 'feature-*'] } }).build?
  end

  # build? returning false

  test 'build returns false if the branch is not included the branches option given as a string' do
    assert Build.new(:branch => 'master', :config => { 'branches' => 'master, develop' }).build?
  end

  test 'build returns false if the branch is not included in the branches option given as an array' do
    assert Build.new(:branch => 'master', :config => { 'branches' => ['master', 'develop'] }).build?
  end

  test 'build returns false if the branch is not included in the branches :only option given as a string' do
    assert Build.new(:branch => 'master', :config => { 'branches' => { 'only' => 'master, develop' } }).build?
  end

  test 'build returns false if the branch is not included in the branches :only option given as an array' do
    assert Build.new(:branch => 'master', :config => { 'branches' => { 'only' => ['master', 'develop'] } }).build?
  end

  test 'build returns false if the branch is included in the branches :except option given as a string' do
    assert Build.new(:branch => 'master', :config => { 'branches' => { 'except' => ['github-pages', 'feature-*'] } }).build?
  end

  test 'build returns false if the branch is included in the branches :except option given as an array' do
    assert Build.new(:branch => 'master', :config => { 'branches' => { 'except' => ['github-pages', 'feature-*'] } }).build?
  end
end
