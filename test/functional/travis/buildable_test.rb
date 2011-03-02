require 'test_helper'

class BuildableTest < ActiveSupport::TestCase
  include Travis, BuildableTestHelper

  Buildable.send :public, :build_dir, :git_url, :config_url, :build!
  Buildable.base_dir = '/tmp/travis/test'

  def setup
    super
    FileUtils.mkdir_p(Buildable.base_dir)
    Buildable.any_instance.stubs(:execute)
  end

  def teardown
    super
    @buildable =  nil
    FileUtils.rm_rf(Buildable.base_dir)
  end

  test 'run!: builds the repository unless it needs to be configured' do
    buildable = Buildable.new(:url => 'http://github.com/svenfuchs/travis')
    buildable.expects(:build!)
    buildable.run!
  end

  test 'run!: configures the repository if it needs to be configured' do
    buildable = Buildable.new(:url => 'http://github.com/svenfuchs/travis')
    buildable.stubs(:config).returns(config(:matrix => { 'rvm' => ['1.8.7', '1.9.2'] }))
    buildable.expects(:configure!)
    buildable.run!
  end

  test 'build!: clones a repository if the build dir is not a git repository' do
    buildable = Buildable.new(:script => 'rake', :url => 'file://~/Development/projects/travis')
    buildable.expects(:clone)
    buildable.build!
  end

  test 'build!: fetches a repository if the build dir is a git repository' do
    buildable = Buildable.new(:script => 'rake', :url => 'file://~/Development/projects/travis')
    buildable.send(:chdir) { `mkdir .git` }
    buildable.expects(:fetch)
    buildable.build!
  end

  test 'build_dir: given a local filesystem url it returns a valid path' do
    buildable = Buildable.new(:script => 'rake', :url => 'file://~/Development/projects/travis')
    assert_match %r(/tmp/travis/test/.*_Development_projects/travis), buildable.build_dir
  end

  test 'build_dir: given a github web url it returns a valid path' do
    buildable = Buildable.new(:script => 'rake', :url => 'http://github.com/svenfuchs/travis')
    assert_equal '/tmp/travis/test/svenfuchs/travis', buildable.build_dir
  end

  test 'git_url: given a local filesystem url it returns the filesystem path' do
    buildable = Buildable.new(:script => 'rake', :url => 'file://~/Development/projects/travis')
    assert_match %r(/.*/Development/projects/travis$), buildable.git_url
  end

  test 'git_url: given a github web url it returns github git url' do
    buildable = Buildable.new(:script => 'rake', :url => 'http://github.com/svenfuchs/travis')
    assert_equal 'git://github.com/svenfuchs/travis.git', buildable.git_url
  end

  test "config_url should return the absolute path the .travis.yml file" do
    buildable = Buildable.new(:script => 'rake', :url => 'file://~/Development/projects/travis')
    assert_equal "#{File.expand_path('.')}/.travis.yml", buildable.config_url
  end
end
