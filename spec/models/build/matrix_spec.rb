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

  describe :matrix_finished? do
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

  describe :matrix_status do
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

  describe :matrix_config do
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

  describe :expand_matrix_config do
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

  describe :expand_matrix do
    it 'sets the config to the tasks' do
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

    it 'copies build attributes' do
      # TODO spec other attributes!
      build = Factory(:build, :config => config)
      build.matrix.map(&:commit_id).uniq.should == [build.commit_id]
    end

    it 'adds a sub-build number to the task number' do
      build = Factory(:build, :config => config)
      assert_equal ['1.1', '1.2', '1.3', '1.4'], build.matrix.map(&:number)[0..3]
    end
  end
end

