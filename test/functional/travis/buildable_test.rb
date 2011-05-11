require 'test_helper'

class BuildableTest < ActiveSupport::TestCase
  include Travis

  Buildable.send :public, *Buildable.protected_instance_methods(false)
  Buildable.base_dir = '/tmp/travis/test'

  def setup
    super
    FileUtils.mkdir_p(Buildable.base_dir)
    Buildable.any_instance.stubs(:system)
    @stdout = $stdout
    # $stdout = StringIO.new
  end

  def teardown
    super
    @buildable =  nil
    FileUtils.rm_rf(Buildable.base_dir)
    $stdout = @stdout
  end

  test 'run!: builds the repository unless it needs to be configured' do
    buildable = Buildable.new
    buildable.expects(:build!)
    buildable.run!
  end

  test 'run!: configures the repository if it needs to be configured' do
    config = { 'rvm' => ['1.8.7', '1.9.2'] }
    buildable = Buildable.new
    buildable.stubs(:config).returns(self.config(config))
    assert_equal config, buildable.run!
  end

  test 'checkout: clones a repository if the build dir is not a git repository' do
    buildable = Buildable.new
    buildable.stubs(:exists?).returns(false)
    buildable.expects(:clone)
    buildable.checkout
  end

  test 'checkout: fetches a repository if the build dir is a git repository' do
    buildable = Buildable.new
    buildable.send(:chdir) { `mkdir .git` }
    buildable.expects(:fetch)
    buildable.checkout
  end

  test "prepend_env: equals the build script if no config is given" do
    buildable = Buildable.new
    buildable.stubs(:config).returns(config)
    assert_equal ['rake ci'], buildable.prepend_env('rake ci')
  end

  test "prepend_env: prepends an rvm command if configured" do
    buildable = Buildable.new(:config => { 'rvm' => '1.9.2' })
    assert_equal ['rvm use 1.9.2', 'rake ci'], buildable.prepend_env('rake ci')
  end

  test "prepend_env: prepends an env var if configured" do
    buildable = Buildable.new(:config => { 'gemfile' => 'gemfiles/rails-2.3.x' })
    assert_equal ["BUNDLE_GEMFILE=#{File.expand_path('gemfiles/rails-2.3.x')} rake ci"], buildable.prepend_env('rake ci')
  end

  test "prepend_env: prepends both rvm command and env var if configured" do
    buildable = Buildable.new(:config => { 'rvm' => '1.9.2', 'gemfile' => 'gemfiles/rails-2.3.x' })
    assert_equal ['rvm use 1.9.2', "BUNDLE_GEMFILE=#{File.expand_path('gemfiles/rails-2.3.x')} rake ci"], buildable.prepend_env('rake ci')
  end

  test 'build_dir: given a local filesystem url it returns a valid path' do
    buildable = Buildable.new(:url => 'file://~/Development/projects/travis')
    assert_match %r(/tmp/travis/test/.*_Development_projects/travis), buildable.build_dir
  end

  test 'build_dir: given a github web url it returns a valid path' do
    buildable = Buildable.new(:url => 'http://github.com/svenfuchs/travis')
    assert_equal '/tmp/travis/test/svenfuchs/travis', buildable.build_dir
  end

  test 'git_url: given a local filesystem url it returns the filesystem path' do
    buildable = Buildable.new(:url => 'file://~/Development/projects/travis')
    assert_match %r(/.*/Development/projects/travis$), buildable.git_url
  end

  test 'git_url: given a github web url it returns github git url' do
    buildable = Buildable.new(:url => 'http://github.com/svenfuchs/travis')
    assert_equal 'git://github.com/svenfuchs/travis.git', buildable.git_url
  end

  test "config_url should return the absolute path the .travis.yml file" do
    buildable = Buildable.new(:url => 'file://~/Development/projects/travis')
    assert_equal "#{File.expand_path('.')}/.travis.yml", buildable.config_url
  end

  test 'install?: returns true if a default Gemfile is present' do
    File.expects(:exists?).with(File.expand_path('Gemfile')).returns(true)
    buildable = Buildable.new
    assert buildable.install?
  end

  test 'install?: returns true if a custom Gemfile is present' do
    File.expects(:exists?).with(File.expand_path('gemfiles/rails-2.3.x')).returns(true)
    buildable = Buildable.new(:config => { 'gemfile' => File.expand_path('gemfiles/rails-2.3.x') })
    assert buildable.install?
  end

  test 'install?: returns false if no Gemfile is present' do
    File.expects(:exists?).with(File.expand_path('Gemfile')).returns(true)
    buildable = Buildable.new
    assert buildable.install?
  end

  test 'install: runs bundle install' do
    buildable = Buildable.new(:config => { :not => :blank })
    buildable.expects(:execute).with(['bundle install '])
    buildable.install
  end

  test 'install: runs bundle install w/ a gemfile prepended' do
    buildable = Buildable.new(:config => { 'gemfile' => 'gemfiles/rails-2.3.x' })
    buildable.expects(:execute).with(["BUNDLE_GEMFILE=#{File.expand_path('gemfiles/rails-2.3.x')} bundle install "])
    buildable.install
  end

  test 'install: runs bundle install w/ env vars prepended' do
    buildable = Buildable.new(:config => { 'env' => 'FOO=bar' })
    buildable.expects(:execute).with(['FOO=bar bundle install '])
    buildable.install
  end

  test 'install: runs bundle install w/ rvm command prepended' do
    buildable = Buildable.new(:config => { 'rvm' => '1.8.7' })
    buildable.expects(:execute).with(['rvm use 1.8.7', 'bundle install '])
    buildable.install
  end

  test 'install: runs bundle install w/ rvm command and env vars prepended' do
    buildable = Buildable.new(:config => { 'script' => 'rake ci', 'rvm' => '1.8.7', 'env' => 'FOO=bar' })
    buildable.expects(:execute).with(['rvm use 1.8.7', 'FOO=bar bundle install '])
    buildable.install
  end

  test 'install: runs bundle install w/ bundler_args appended' do
    buildable = Buildable.new(:config => {:bundler_args => '--binstubs'})
    buildable.expects(:execute).with(['bundle install --binstubs'])
    buildable.install
  end
 
  test 'script: returns the correct information ' do
    buildable = Buildable.new(:config => { 'script' => 'rake ci','before_script' => ['cmd1' ], 'after_script' => ['cmd2']})
    assert_equal ['cmd1'] , buildable.script('before_script')    
  end

  test 'run_scripts: iterates over keys and executes appropriate script' do
    buildable = Buildable.new(:config => { 'script' => 'rake ci','before_script' => ['cmd1' ], 'after_script' => ['cmd2']})
    buildable.expects(:run_script).with('before_script').returns(true)
    buildable.expects(:run_script).with('script').returns(true)
    buildable.expects(:run_script).with('after_script').returns(true)
    buildable.run_scripts 
  end

  test 'run_scripts: returns as soon as a script fails' do 
    buildable = Buildable.new(:config => { 'script' => 'rake ci','before_script' => ['cmd1' ], 'after_script' => ['cmd2']})
    buildable.expects(:run_script).with('before_script').returns(false)
    buildable.expects(:execute).with(['cmd1']).never
    buildable.expects(:run_script).with('cmd2').never
    assert_equal false , buildable.run_scripts 
  end

  test 'run_script: executes the build script' do
    buildable = Buildable.new(:config => { 'script' => 'rake ci' })
    buildable.expects(:execute).with(['rake ci'])
    buildable.run_script('script')
  end

  test 'run_script: executes the build script w/ a gemfile prepended' do
    buildable = Buildable.new(:config => { 'script' => 'rake ci', 'gemfile' => 'gemfiles/rails-2.3.x' })
    buildable.expects(:execute).with(["BUNDLE_GEMFILE=#{File.expand_path('gemfiles/rails-2.3.x')} rake ci"])
    buildable.run_script('script')
  end

  test 'run_script: executes the build script w/ env vars prepended' do
    buildable = Buildable.new(:config => { 'script' => 'rake ci', 'env' => 'FOO=bar' })
    buildable.expects(:execute).with(['FOO=bar rake ci'])
    buildable.run_script('script')
  end

  test 'run_script: executes the build script w/ rvm command prepended' do
    buildable = Buildable.new(:config => { 'script' => 'rake ci', 'rvm' => '1.8.7' })
    buildable.expects(:execute).with(['rvm use 1.8.7', 'rake ci'])
    buildable.run_script('script')
  end

  test 'run_script: executes the build script w/ rvm command and env vars prepended' do
    buildable = Buildable.new(:config => { 'script' => 'rake ci', 'rvm' => '1.8.7', 'env' => 'FOO=bar' })
    buildable.expects(:execute).with(['rvm use 1.8.7', 'FOO=bar rake ci'])
    buildable.run_script('script')
  end

  test 'run_script: executes the before_script ' do 
    buildable = Buildable.new(:config => { 'script' => 'rake ci','before_script' => 'cmd1'})
    buildable.expects(:execute).with(['cmd1'])
    buildable.run_script('before_script')
  end

  test 'run_script: executes the after_script ' do 
    buildable = Buildable.new(:config => { 'script' => 'rake ci','after_script' => 'cmd1'})
    buildable.expects(:execute).with(['cmd1'])
    buildable.run_script('after_script')
  end

  test 'echoize: echo the command before executing it (1)' do
    assert_equal "echo \\$\\ rake\nrake", Buildable.new.echoize('rake')
  end

  test 'echoize: echo the command before executing it (2)' do
    assert_equal "echo \\$\\ rvm\\ use\\ 1.9.2\nrvm use 1.9.2\necho \\$\\ FOO\\=bar\\ rake\\ ci\nFOO=bar rake ci", Buildable.new.echoize(['rvm use 1.9.2', 'FOO=bar rake ci'])
  end
end
