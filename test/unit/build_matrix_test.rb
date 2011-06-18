require 'test_helper'

class BuildTest < ActiveSupport::TestCase
  Build.send(:public, :expand_matrix!, :matrix_config, :expand_matrix_config)

  attr_reader :config

  def setup
    super
    @config = YAML.load <<-yaml
      script: rake ci
      rvm:
        - 1.8.7
        - 1.9.2
      gemfile:
        - gemfiles/rails-2.3.x
        - gemfiles/rails-3.0.x
    yaml
  end

  test 'updating the build config w/ stupid rack params' do
    build = Factory(:build, :config => {
      'rvm'     => { '0' => '1.8.7', '1' => '1.9.2' },
      'gemfile' => { '0' => 'gemfiles/rails-2.3.x', '1' => 'gemfiles/rails-3.0.x' },
      'env'     => { '0' => 'FOO=bar', '1' => 'FOO=baz' }
    })
    expected = {
      'rvm'     => ['1.8.7', '1.9.2'],
      'gemfile' => ['gemfiles/rails-2.3.x', 'gemfiles/rails-3.0.x'],
      'env'     => ['FOO=bar', 'FOO=baz']
    }
    assert_equal expected, build.config
  end

  test 'matrix_config w/ no array values' do
    build = Factory(:build, :config => { 'rvm' => '1.8.7', 'gemfile' => 'gemfiles/rails-2.3.x', 'env' => 'FOO=bar' })
    assert_nil build.matrix_config
  end

  test 'matrix_config w/ just array values' do
    build = Factory(:build, :config => { 'rvm' => ['1.8.7', '1.9.2'], 'gemfile' => ['gemfiles/rails-2.3.x', 'gemfiles/rails-3.0.x'] })
    expected = [
      [['rvm', '1.8.7'], ['rvm', '1.9.2']],
      [['gemfile', 'gemfiles/rails-2.3.x'], ['gemfile', 'gemfiles/rails-3.0.x']]
    ]
    assert_equal expected, build.matrix_config
  end

  test 'matrix_config w/ unjust array values' do
    build = Factory(:build, :config => { 'rvm' => ['1.8.7', '1.9.2', 'ree'], 'gemfile' => ['gemfiles/rails-3.0.x'], 'env' => ['FOO=bar', 'FOO=baz'] })
    expected = [
      [['rvm', '1.8.7'], ['rvm', '1.9.2'], ['rvm', 'ree']],
      [['gemfile', 'gemfiles/rails-3.0.x'], ['gemfile', 'gemfiles/rails-3.0.x'], ['gemfile', 'gemfiles/rails-3.0.x']],
      [['env', 'FOO=bar'], ['env', 'FOO=baz'], ['env', 'FOO=baz']]
    ]
    assert_equal expected, build.matrix_config
  end

  test 'matrix_config w/ an array value and a non-array value' do
    build = Factory(:build, :config => { 'rvm' => ['1.8.7', '1.9.2'], 'gemfile' => 'gemfiles/rails-2.3.x' })
    expected = [
      [['rvm', '1.8.7'], ['rvm', '1.9.2']],
      [['gemfile', 'gemfiles/rails-2.3.x'], ['gemfile', 'gemfiles/rails-2.3.x']]
    ]
    assert_equal expected, build.matrix_config
  end

  test 'expanding the build matrix configuration' do
    build = Factory(:build, :config => config)
    expected = [
      [['rvm', '1.8.7'], ['gemfile', 'gemfiles/rails-2.3.x']],
      [['rvm', '1.8.7'], ['gemfile', 'gemfiles/rails-3.0.x']],
      [['rvm', '1.9.2'], ['gemfile', 'gemfiles/rails-2.3.x']],
      [['rvm', '1.9.2'], ['gemfile', 'gemfiles/rails-3.0.x']]
    ]
    assert_equal expected, build.expand_matrix_config(build.matrix_config.to_a)
  end

  test 'expanding the build matrix configuration (rspec-rails)' do
    config = YAML.load <<-yaml
      script: "rake ci --trace 2>&1"
      rvm:
        - 1.8.7
        - 1.9.1
        - 1.9.2
      gemfile:
        - gemfiles/rails-3.0.6
        - gemfiles/rails-3.0.7
        - gemfiles/rails-3-0-stable
        - gemfiles/rails-master
      env:
        - USE_GIT_REPOS=true
    yaml
    build = Factory(:build, :config => config)
    expected = [
      [['rvm', '1.8.7'], ['gemfile', 'gemfiles/rails-3.0.6'],      ['env', 'USE_GIT_REPOS=true']],
      [['rvm', '1.8.7'], ['gemfile', 'gemfiles/rails-3.0.7'],      ['env', 'USE_GIT_REPOS=true']],
      [['rvm', '1.8.7'], ['gemfile', 'gemfiles/rails-3-0-stable'], ['env', 'USE_GIT_REPOS=true']],
      [['rvm', '1.8.7'], ['gemfile', 'gemfiles/rails-master'],     ['env', 'USE_GIT_REPOS=true']],
      [['rvm', '1.9.1'], ['gemfile', 'gemfiles/rails-3.0.6'],      ['env', 'USE_GIT_REPOS=true']],
      [['rvm', '1.9.1'], ['gemfile', 'gemfiles/rails-3.0.7'],      ['env', 'USE_GIT_REPOS=true']],
      [['rvm', '1.9.1'], ['gemfile', 'gemfiles/rails-3-0-stable'], ['env', 'USE_GIT_REPOS=true']],
      [['rvm', '1.9.1'], ['gemfile', 'gemfiles/rails-master'],     ['env', 'USE_GIT_REPOS=true']],
      [['rvm', '1.9.2'], ['gemfile', 'gemfiles/rails-3.0.6'],      ['env', 'USE_GIT_REPOS=true']],
      [['rvm', '1.9.2'], ['gemfile', 'gemfiles/rails-3.0.7'],      ['env', 'USE_GIT_REPOS=true']],
      [['rvm', '1.9.2'], ['gemfile', 'gemfiles/rails-3-0-stable'], ['env', 'USE_GIT_REPOS=true']],
      [['rvm', '1.9.2'], ['gemfile', 'gemfiles/rails-master'],     ['env', 'USE_GIT_REPOS=true']]
    ]
    assert_equal expected, build.expand_matrix_config(build.matrix_config.to_a)
  end

  test 'expanding a matrix build sets the config to the children' do
    build = Factory(:build, :config => config)
    expected = [
      { 'script' => 'rake ci', 'rvm' => '1.8.7', 'gemfile' => 'gemfiles/rails-2.3.x' },
      { 'script' => 'rake ci', 'rvm' => '1.8.7', 'gemfile' => 'gemfiles/rails-3.0.x' },
      { 'script' => 'rake ci', 'rvm' => '1.9.2', 'gemfile' => 'gemfiles/rails-2.3.x' },
      { 'script' => 'rake ci', 'rvm' => '1.9.2', 'gemfile' => 'gemfiles/rails-3.0.x' }
    ]
    assert_equal expected, build.matrix.map(&:config)
  end

  test 'expanding a matrix build sets the config to the children (rspec-rails)' do
    config = YAML.load <<-yaml
      script: "rake ci"
      rvm:
        - 1.8.7
        - 1.9.1
        - 1.9.2
      gemfile:
        - gemfiles/rails-3.0.6
        - gemfiles/rails-3.0.7
        - gemfiles/rails-3-0-stable
        - gemfiles/rails-master
      env:
        - USE_GIT_REPOS=true
    yaml
    build = Factory(:build, :config => config)
    expected = [
      { 'script' => 'rake ci', 'rvm' => '1.8.7', 'gemfile' => 'gemfiles/rails-3.0.6',      'env' => 'USE_GIT_REPOS=true' },
      { 'script' => 'rake ci', 'rvm' => '1.8.7', 'gemfile' => 'gemfiles/rails-3.0.7',      'env' => 'USE_GIT_REPOS=true' },
      { 'script' => 'rake ci', 'rvm' => '1.8.7', 'gemfile' => 'gemfiles/rails-3-0-stable', 'env' => 'USE_GIT_REPOS=true' },
      { 'script' => 'rake ci', 'rvm' => '1.8.7', 'gemfile' => 'gemfiles/rails-master',     'env' => 'USE_GIT_REPOS=true' },
      { 'script' => 'rake ci', 'rvm' => '1.9.1', 'gemfile' => 'gemfiles/rails-3.0.6',      'env' => 'USE_GIT_REPOS=true' },
      { 'script' => 'rake ci', 'rvm' => '1.9.1', 'gemfile' => 'gemfiles/rails-3.0.7',      'env' => 'USE_GIT_REPOS=true' },
      { 'script' => 'rake ci', 'rvm' => '1.9.1', 'gemfile' => 'gemfiles/rails-3-0-stable', 'env' => 'USE_GIT_REPOS=true' },
      { 'script' => 'rake ci', 'rvm' => '1.9.1', 'gemfile' => 'gemfiles/rails-master',     'env' => 'USE_GIT_REPOS=true' },
      { 'script' => 'rake ci', 'rvm' => '1.9.2', 'gemfile' => 'gemfiles/rails-3.0.6',      'env' => 'USE_GIT_REPOS=true' },
      { 'script' => 'rake ci', 'rvm' => '1.9.2', 'gemfile' => 'gemfiles/rails-3.0.7',      'env' => 'USE_GIT_REPOS=true' },
      { 'script' => 'rake ci', 'rvm' => '1.9.2', 'gemfile' => 'gemfiles/rails-3-0-stable', 'env' => 'USE_GIT_REPOS=true' },
      { 'script' => 'rake ci', 'rvm' => '1.9.2', 'gemfile' => 'gemfiles/rails-master',     'env' => 'USE_GIT_REPOS=true' },
    ]
    assert_equal expected, build.matrix.map(&:config)
  end

  test 'using a configuration with single values (no matrix)' do
    config = YAML.load <<-yaml
      script: "rake ci"
      rvm:
        - 1.9.2
      gemfile:
        - gemfiles/rails-2.3.x
      env:
        - USE_GIT_REPOS=true
    yaml
    build = Factory(:build, :config => config)
    expected = { 'script' => 'rake ci', 'rvm' => ['1.9.2'], 'gemfile' => ['gemfiles/rails-2.3.x'], 'env' => ['USE_GIT_REPOS=true'] }
    assert_equal expected, build.config
  end

  test 'expanding a matrix build copies the build attributes' do
    build = Factory(:build, :commit => '12345', :config => config)
    assert_equal ['12345'] * 4, build.matrix.map(&:commit)
  end

  test 'expanding a matrix build adds a sub-build number to the build number' do
    build = Factory(:build, :number => '2', :config => config)
    assert_equal ['2.1', '2.2', '2.3', '2.4'], build.matrix.map(&:number)
  end

  test 'matrix_expanded? returns true if the matrix has just been expanded' do
    assert Factory(:build, :config => config).matrix_expanded?
  end

  test 'matrix_expanded? returns false if there is no matrix' do
    assert !Factory(:build).matrix_expanded?
  end

  test 'matrix_expanded? returns false if the matrix existed before' do
    build = Factory(:build, :config => config)
    build.save!
    assert !build.matrix_expanded?
  end

  # test 'update_matrix_status! does not do anything if any child build has not finished' do
  #   build = Factory(:build, :config => { 'rvm' => ['1.8.7', '1.9.2'] })
  #   build.update_matrix_status!
  #   assert_equal nil, build.reload.status
  # end

  test 'update_matrix_status! sets the status to 1 if any child has the status 1' do
    build = Factory(:build, :config => { 'rvm' => ['1.8.7', '1.9.2'] })
    build.matrix[0].update_attributes(:status => 1, :finished_at => Time.now)
    build.matrix[1].update_attributes(:status => 0, :finished_at => Time.now)
    assert_equal 1, build.reload.status
  end

  test 'update_matrix_status! sets the status to 0 if all children have the status 0' do
    build = Factory(:build, :config => { 'rvm' => ['1.8.7', '1.9.2'] })
    build.matrix[0].update_attributes(:status => 0, :finished_at => Time.now)
    build.matrix[1].update_attributes(:status => 0, :finished_at => Time.now)
    assert_equal 0, build.reload.status
  end

  test 'matrix build as_json' do
    build = Factory(:build, :number => '2', :commit => '12345', :config => config)
    build_attributes = {
      'id' => build.id,
      'repository_id' => build.repository.id,
      'number' => '2',
      'commit' => '12345',
      'branch' => 'master',
      'message' => 'the commit message',
      'committer_name' => 'Sven Fuchs',
      'committer_email' => 'svenfuchs@artweb-design.de',
      'config' => { 'script' => 'rake ci', 'gemfile' => ['gemfiles/rails-2.3.x', 'gemfiles/rails-3.0.x'], 'rvm' => ['1.8.7', '1.9.2']},
    }
    matrix_attributes = {
      'repository_id' => build.repository.id,
      'parent_id' => build.id,
      'commit' => '12345',
      'branch' => 'master',
      'committer_name' => 'Sven Fuchs',
      'committer_email' => 'svenfuchs@artweb-design.de',
      'message' => 'the commit message',
    }
    expected = build_attributes.merge(
      'matrix' => [
        matrix_attributes.merge('id' => build.id + 1, 'number' => '2.1', 'config' => { 'script' => 'rake ci', 'gemfile' => 'gemfiles/rails-2.3.x', 'rvm' => '1.8.7' }),
        matrix_attributes.merge('id' => build.id + 2, 'number' => '2.2', 'config' => { 'script' => 'rake ci', 'gemfile' => 'gemfiles/rails-3.0.x', 'rvm' => '1.8.7' }),
        matrix_attributes.merge('id' => build.id + 3, 'number' => '2.3', 'config' => { 'script' => 'rake ci', 'gemfile' => 'gemfiles/rails-2.3.x', 'rvm' => '1.9.2' }),
        matrix_attributes.merge('id' => build.id + 4, 'number' => '2.4', 'config' => { 'script' => 'rake ci', 'gemfile' => 'gemfiles/rails-3.0.x', 'rvm' => '1.9.2' }),
      ]
    )
    assert_equal_hashes expected, build.as_json(:for => :'build:started')
  end
end

