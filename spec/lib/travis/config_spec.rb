require 'spec_helper'

describe Travis, 'config' do
  let(:config) { Travis::Config.new }

  after { ENV.delete('travis_config') }

  describe 'Hashr behaviour' do
    it 'is a Hashr instance' do
      config.should be_kind_of(Hashr)
    end

    it 'returns Hashr instances on subkeys' do
      ENV['travis_config'] = YAML.dump('redis' => { 'url' => 'redis://localhost:6379' })
      config.redis.should be_kind_of(Hashr)
    end

    it 'returns Hashr instances on subkeys that were set to Ruby Hashes' do
      config.foo = { :bar => { :baz => 'baz' } }
      config.foo.bar.should be_kind_of(Hashr)
    end
  end

  describe 'defaults' do
    it 'notifications defaults to []' do
      config.notifications.should == []
    end

    it 'queues defaults to []' do
      config.queues.should == []
    end
  end

  describe 'the example config file' do
    let(:data)    { YAML.load_file(File.expand_path('config/travis.example.yml'))['production'] }
    before(:each) { Travis::Config.stubs(:load_file).returns(data) }

    it 'can access pusher' do
      lambda { config.pusher.key }.should_not raise_error
    end

    it 'can access all keys recursively' do
      nested_access = lambda do |config, data|
        data.keys.each do |key|
          lambda { config.send(key) }.should_not raise_error
          nested_access.call(config.send(key), data[key]) if data[key].is_a?(Hash)
        end
      end
      nested_access.call(config, data)
    end
  end

  it 'deep symbolizes arrays, too' do
    config = Travis::Config.new('queues' => [{ 'slug' => 'rails/rails', 'queue' => 'rails' }])
    assert_equal ['rails/rails', 'rails'], config.queues.first.values_at(:slug, :queue)
  end
end
