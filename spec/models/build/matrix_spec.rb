require 'spec_helper'

describe Build, 'matrix' do
  before { Build.send :public, :matrix_config, :expand_matrix_config }
  after  { Build.send :protected, :matrix_config, :expand_matrix_config }

  let(:config) {
    YAML.load <<-yml
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
    yml
  }

  describe 'matrix_config' do
    it 'with string values' do
      build = Factory(:build, :config => { :rvm => '1.8.7', :gemfile => 'gemfiles/rails-2.3.x', :env => 'FOO=bar' })
      build.matrix_config.should be_nil
    end

    it 'with just array values' do
      build = Factory(:build, :config => { :rvm => ['1.8.7', '1.9.2'], :gemfile => ['gemfiles/rails-2.3.x', 'gemfiles/rails-3.0.x'] })
      expected = [
        [[:rvm, '1.8.7'], [:rvm, '1.9.2']],
        [[:gemfile, 'gemfiles/rails-2.3.x'], [:gemfile, 'gemfiles/rails-3.0.x']]
      ]
      build.matrix_config.should == expected
    end

    it 'with unjust array values' do
      build = Factory(:build, :config => { :rvm => ['1.8.7', '1.9.2', 'ree'], :gemfile => ['gemfiles/rails-3.0.x'], :env => ['FOO=bar', 'FOO=baz'] })
      build.matrix_config.should == [
        [[:rvm, '1.8.7'], [:rvm, '1.9.2'], [:rvm, 'ree']],
        [[:gemfile, 'gemfiles/rails-3.0.x'], [:gemfile, 'gemfiles/rails-3.0.x'], [:gemfile, 'gemfiles/rails-3.0.x']],
        [[:env, 'FOO=bar'], [:env, 'FOO=baz'], [:env, 'FOO=baz']]
      ]
    end

    it 'with an array value and a non-array value' do
      build = Factory(:build, :config => { :rvm => ['1.8.7', '1.9.2'], :gemfile => 'gemfiles/rails-2.3.x' })
      build.matrix_config.should == [
        [[:rvm, '1.8.7'], [:rvm, '1.9.2']],
        [[:gemfile, 'gemfiles/rails-2.3.x'], [:gemfile, 'gemfiles/rails-2.3.x']]
      ]
    end
  end

  describe 'expand_matrix_config' do
    it 'expands the build matrix configuration' do
      build = Factory(:build, :config => config)
      build.expand_matrix_config(build.matrix_config.to_a).should == [
        [[:rvm, '1.8.7'], [:gemfile, 'gemfiles/rails-3.0.6'],      [:env, 'USE_GIT_REPOS=true']],
        [[:rvm, '1.8.7'], [:gemfile, 'gemfiles/rails-3.0.7'],      [:env, 'USE_GIT_REPOS=true']],
        [[:rvm, '1.8.7'], [:gemfile, 'gemfiles/rails-3-0-stable'], [:env, 'USE_GIT_REPOS=true']],
        [[:rvm, '1.8.7'], [:gemfile, 'gemfiles/rails-master'],     [:env, 'USE_GIT_REPOS=true']],
        [[:rvm, '1.9.1'], [:gemfile, 'gemfiles/rails-3.0.6'],      [:env, 'USE_GIT_REPOS=true']],
        [[:rvm, '1.9.1'], [:gemfile, 'gemfiles/rails-3.0.7'],      [:env, 'USE_GIT_REPOS=true']],
        [[:rvm, '1.9.1'], [:gemfile, 'gemfiles/rails-3-0-stable'], [:env, 'USE_GIT_REPOS=true']],
        [[:rvm, '1.9.1'], [:gemfile, 'gemfiles/rails-master'],     [:env, 'USE_GIT_REPOS=true']],
        [[:rvm, '1.9.2'], [:gemfile, 'gemfiles/rails-3.0.6'],      [:env, 'USE_GIT_REPOS=true']],
        [[:rvm, '1.9.2'], [:gemfile, 'gemfiles/rails-3.0.7'],      [:env, 'USE_GIT_REPOS=true']],
        [[:rvm, '1.9.2'], [:gemfile, 'gemfiles/rails-3-0-stable'], [:env, 'USE_GIT_REPOS=true']],
        [[:rvm, '1.9.2'], [:gemfile, 'gemfiles/rails-master'],     [:env, 'USE_GIT_REPOS=true']]
      ]
    end
  end

  it 'expanding a matrix build sets the config to the tasks' do
    build = Factory(:build, :config => config)
    build.matrix.map(&:config).should == [
      { :script => 'rake ci', :rvm => '1.8.7', :gemfile => 'gemfiles/rails-3.0.6',      :env => 'USE_GIT_REPOS=true' },
      { :script => 'rake ci', :rvm => '1.8.7', :gemfile => 'gemfiles/rails-3.0.7',      :env => 'USE_GIT_REPOS=true' },
      { :script => 'rake ci', :rvm => '1.8.7', :gemfile => 'gemfiles/rails-3-0-stable', :env => 'USE_GIT_REPOS=true' },
      { :script => 'rake ci', :rvm => '1.8.7', :gemfile => 'gemfiles/rails-master',     :env => 'USE_GIT_REPOS=true' },
      { :script => 'rake ci', :rvm => '1.9.1', :gemfile => 'gemfiles/rails-3.0.6',      :env => 'USE_GIT_REPOS=true' },
      { :script => 'rake ci', :rvm => '1.9.1', :gemfile => 'gemfiles/rails-3.0.7',      :env => 'USE_GIT_REPOS=true' },
      { :script => 'rake ci', :rvm => '1.9.1', :gemfile => 'gemfiles/rails-3-0-stable', :env => 'USE_GIT_REPOS=true' },
      { :script => 'rake ci', :rvm => '1.9.1', :gemfile => 'gemfiles/rails-master',     :env => 'USE_GIT_REPOS=true' },
      { :script => 'rake ci', :rvm => '1.9.2', :gemfile => 'gemfiles/rails-3.0.6',      :env => 'USE_GIT_REPOS=true' },
      { :script => 'rake ci', :rvm => '1.9.2', :gemfile => 'gemfiles/rails-3.0.7',      :env => 'USE_GIT_REPOS=true' },
      { :script => 'rake ci', :rvm => '1.9.2', :gemfile => 'gemfiles/rails-3-0-stable', :env => 'USE_GIT_REPOS=true' },
      { :script => 'rake ci', :rvm => '1.9.2', :gemfile => 'gemfiles/rails-master',     :env => 'USE_GIT_REPOS=true' },
    ]
  end

  describe 'expanding the matrix' do
    it 'expanding a matrix build copies build attributes' do
      build = Factory(:build, :config => config)
      build.matrix.map(&:commit_id).uniq.should == [build.commit_id]
    end

    it 'expanding a matrix build adds a sub-build number to the task number' do
      build = Factory(:build, :number => '2', :config => config)
      assert_equal ['2.1', '2.2', '2.3', '2.4'], build.matrix.map(&:number)[0..3]
    end
  end

  describe 'matrix_finished?' do
    it 'returns false if at least one task has not finished' do
      build = Factory(:build, :config => { :rvm => ['1.8.7', '1.9.2'] })
      build.matrix[0].update_attributes(:finished_at => Time.now)
      build.matrix[1].update_attributes(:finished_at => nil)

      build.matrix_finished?.should_not be_true
    end

    it 'returns true if all tasks have finished' do
      build = Factory(:build, :config => { :rvm => ['1.8.7', '1.9.2'] })
      build.matrix[0].update_attributes!(:state => :finished)
      build.matrix[1].update_attributes!(:state => :finished)

      build.matrix_finished?.should_not be_nil
    end
  end

  describe 'matrix_expanded?' do
    xit 'returns true if the matrix has just been expanded' do
      assert Factory(:build, :config => config).matrix_expanded?
    end

    xit 'returns false if there is no matrix' do
      assert !Factory(:build).matrix_expanded?
    end

    xit 'returns false if the matrix existed before' do
      build = Factory(:build, :config => config)
      build.save!
      assert !build.matrix_expanded?
    end
  end

  describe 'matrix_status' do
    it 'returns 1 if any task has the status 1' do
      build = Factory(:build, :config => { :rvm => ['1.8.7', '1.9.2'] })
      build.matrix[0].update_attributes!(:status => 1, :state => :finished)
      build.matrix[1].update_attributes!(:status => 0, :state => :finished)
      build.matrix_status.should == 1
    end

    it 'returns 0 if all tasks have the status 0' do
      build = Factory(:build, :config => { :rvm => ['1.8.7', '1.9.2'] })
      build.matrix[0].update_attributes!(:status => 0, :state => :finished)
      build.matrix[1].update_attributes!(:status => 0, :state => :finished)
      build.matrix_status.should == 0
    end
  end

  xit 'matrix build as_json' do
    build = Factory(:build, :number => '2', :config => config)
    build_attributes = {
      :id => build.id,
      :repository_id => build.repository.id,
      :number => '2',
      :commit => '12345',
      :branch => 'master',
      :message => 'the commit message',
      :committer_name => 'Sven Fuchs',
      :committer_email => 'svenfuchs@artweb-design.de',
      :config => { :script => 'rake ci', :gemfile => ['gemfiles/rails-2.3.x', 'gemfiles/rails-3.0.x'], :rvm => ['1.8.7', '1.9.2']},
    }
    matrix_attributes = {
      :repository_id => build.repository.id,
      :parent_id => build.id,
      :commit => '12345',
      :branch => 'master',
      :committer_name => 'Sven Fuchs',
      :committer_email => 'svenfuchs@artweb-design.de',
      :message => 'the commit message',
    }
    expected = build_attributes.merge(
      :matrix => [
        matrix_attributes.merge(:id => build.id + 1, :number => '2.1', :config => { :script => 'rake ci', :gemfile => 'gemfiles/rails-2.3.x', :rvm => '1.8.7' }),
        matrix_attributes.merge(:id => build.id + 2, :number => '2.2', :config => { :script => 'rake ci', :gemfile => 'gemfiles/rails-3.0.x', :rvm => '1.8.7' }),
        matrix_attributes.merge(:id => build.id + 3, :number => '2.3', :config => { :script => 'rake ci', :gemfile => 'gemfiles/rails-2.3.x', :rvm => '1.9.2' }),
        matrix_attributes.merge(:id => build.id + 4, :number => '2.4', :config => { :script => 'rake ci', :gemfile => 'gemfiles/rails-3.0.x', :rvm => '1.9.2' }),
      ]
    )
    assert_equal_hashes expected, build.as_json(:for => :'build:started')
  end
end

