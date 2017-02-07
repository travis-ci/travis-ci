require 'spec_helper'

describe Request do
  let(:request) { Factory(:request).reload }

  context 'on creation' do
    it 'also creates its configure task' do
      request.task.should be_instance_of(Task::Configure)
    end
  end

  context 'on configuration' do
    it 'stores the config (even if not approved)' do
      config = { :branches => { :except => 'master' } }
      request.configure!(:config => config)
      request.reload

      request.configured?(true).should be_true
      request.config.should == config
    end

    it 'finishes the request and creates a build if approved' do
      request.configure!(:config => { :branches => { :only => 'master' } })
      request.reload

      request.finished?.should be_true
      request.approved?.should be_true
      request.builds.first.should be_instance_of(Build)
    end

    it 'finishes the request but does not create a build unless approved' do
      request.configure!(:config => { :branches => { :except => 'master' } })
      request.reload

      request.finished?.should be_true
      request.approved?.should be_false
      request.builds.should be_empty
    end

    it "finishes the request and expands build matrix" do
      request

      lambda {
        request.configure!(:config => { :rvm => [ '1.8.7', '1.9.2' ], :gemfile => [ 'gemfiles/first_one', 'gemfiles/second_one' ] })
      }.should change(Task, :count).by(4)

      [ { :rvm => '1.8.7', :gemfile => 'gemfiles/first_one' },
        { :rvm => '1.8.7', :gemfile => 'gemfiles/second_one' },
        { :rvm => '1.9.2', :gemfile => 'gemfiles/first_one' },
        { :rvm => '1.9.2', :gemfile => 'gemfiles/second_one' }].each do |configuration|
        Task.where("config LIKE '%#{configuration[:rvm]}%#{configuration[:gemfile]}%'").count.should eql 1
      end
    end
  end

  describe 'helper methods' do
    it 'normalize_config normalizes hashes with numerical keys to arrays (required for input coming from rack params)' do
      actual = request.send(:normalize_config, {
        'rvm'     => { '0' => '1.8.7', '1' => '1.9.2' },
        'gemfile' => { '0' => 'gemfiles/rails-2.3.x', '1' => 'gemfiles/rails-3.0.x' },
        'env'     => { '0' => 'FOO=bar', '1' => 'FOO=baz' }
      })
      actual.should == {
        :rvm     => ['1.8.7', '1.9.2'],
        :gemfile => ['gemfiles/rails-2.3.x', 'gemfiles/rails-3.0.x'],
        :env     => ['FOO=bar', 'FOO=baz']
      }
    end
  end
end

