require 'test_helper'

class BuildBranchesTest < ActiveSupport::TestCase

  # approved? returning true

  test 'approved? returns true if there is no branches option' do
    assert Build.new(:branch => 'master').approved?
  end

  test 'approved? returns true if the branch is included the branches option given as a string' do
    assert Build.new(:branch => 'master', :config => { 'branches' => 'master, develop' }).approved?
  end

  test 'approved? returns true if the branch is included in the branches option given as an array' do
    assert Build.new(:branch => 'master', :config => { 'branches' => ['master', 'develop'] }).approved?
  end

  test 'approved? returns true if the branch is included in the branches :only option given as a string' do
    assert Build.new(:branch => 'master', :config => { 'branches' => { 'only' => { 'branches' => 'master, develop' } } }).approved?
  end

  test 'approved? returns true if the branch is included in the branches :only option given as an array' do
    assert Build.new(:branch => 'master', :config => { 'branches' => { 'only' => ['master', 'develop'] } }).approved?
  end

  test 'approved? returns true if the branch is not included in the branches :except option given as a string' do
    assert Build.new(:branch => 'master', :config => { 'branches' => { 'except' => ['github-pages', 'feature-*'] } }).approved?
  end

  test 'approved? returns true if the branch is not included in the branches :except option given as an array' do
    assert Build.new(:branch => 'master', :config => { 'branches' => { 'except' => ['github-pages', 'feature-*'] } }).approved?
  end

  # approved? returning false

  test 'approved? returns false if the branch is not included the branches option given as a string' do
    assert Build.new(:branch => 'master', :config => { 'branches' => 'master, develop' }).approved?
  end

  test 'approved? returns false if the branch is not included in the branches option given as an array' do
    assert Build.new(:branch => 'master', :config => { 'branches' => ['master', 'develop'] }).approved?
  end

  test 'approved? returns false if the branch is not included in the branches :only option given as a string' do
    assert Build.new(:branch => 'master', :config => { 'branches' => { 'only' => 'master, develop' } }).approved?
  end

  test 'approved? returns false if the branch is not included in the branches :only option given as an array' do
    assert Build.new(:branch => 'master', :config => { 'branches' => { 'only' => ['master', 'develop'] } }).approved?
  end

  test 'approved? returns false if the branch is included in the branches :except option given as a string' do
    assert Build.new(:branch => 'master', :config => { 'branches' => { 'except' => ['github-pages', 'feature-*'] } }).approved?
  end

  test 'approved? returns false if the branch is included in the branches :except option given as an array' do
    assert Build.new(:branch => 'master', :config => { 'branches' => { 'except' => ['github-pages', 'feature-*'] } }).approved?
  end
end
