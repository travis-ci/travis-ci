require 'test_helper'

class BuildableTest < Test::Unit::TestCase
  include Travis
  Buildable.send :public, :build_dir, :git_uri
  Buildable.base_dir = '/tmp/travis/test'

  def setup
    FileUtils.mkdir_p(Buildable.base_dir)
    Buildable.any_instance.stubs(:execute)
    super
  end

  def teardown
    FileUtils.rm_rf(Buildable.base_dir)
    super
  end

  test 'build: clones a repository if the build dir is not a git repository' do
    buildable = Buildable.new("file://~/Development/projects/travis")
    buildable.expects(:clone)
    buildable.build
  end

  test 'build: fetches a repository if the build dir is a git repository' do
    buildable = Buildable.new('file://~/Development/projects/travis')
    buildable.send(:chdir) { `mkdir .git` }
    buildable.expects(:fetch)
    buildable.build
  end

  test 'build_dir: given a local filesystem uri it returns a valid path' do
    buildable = Buildable.new('file://~/Development/projects/travis')
    assert_match %r(/tmp/travis/test/.*_Development_projects/travis), buildable.build_dir
  end

  test 'build_dir: given a github web uri it returns a valid path' do
    buildable = Buildable.new('http://github.com/svenfuchs/travis')
    assert_equal '/tmp/travis/test/svenfuchs/travis', buildable.build_dir
  end

  test 'git_uri: given a local filesystem uri it returns the filesystem path' do
    buildable = Buildable.new('file://~/Development/projects/travis')
    assert_match %r(/.*/Development/projects/travis$), buildable.git_uri
  end

  test 'git_uri: given a github web uri it returns github git uri' do
    buildable = Buildable.new('http://github.com/svenfuchs/travis')
    assert_equal 'git://github.com/svenfuchs/travis.git', buildable.git_uri
  end
end

