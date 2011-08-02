require 'test_helper'

class RequestTest < ActiveSupport::TestCase
  attr_reader :request

  def setup
    @request = Factory(:request)
  end

  test "on creation: it also creates its configure task" do
    assert Factory(:request).reload.task.is_a?(Task::Configure)
  end

  test "on configuration: it stores the config (even if not approved)" do
    config  = { :branches => { :except => 'master' } }
    request.configure!(config)
    request.reload

    assert request.configured?(true)
    assert_equal config, request.config
  end

  test "on configuration: it finishes the request and creates a build if approved" do
    request.configure!(:branches => { :only => 'master' })
    request.reload

    assert request.finished?
    assert request.approved?
    assert request.builds.first.is_a?(Build)
  end

#          number     = repository.builds.next_number

  test "on configuration: it finishes the request but does not create a build unless approved" do
    request.configure!(:branches => { :except => 'master' })
    request.reload

    assert request.finished?
    assert !request.approved?
    assert request.builds.empty?
  end

  test 'normalize_config normalizes hashes with numerical keys to arrays (required for rack params)' do
    actual = request.send(:normalize_config, {
      'rvm'     => { '0' => '1.8.7', '1' => '1.9.2' },
      'gemfile' => { '0' => 'gemfiles/rails-2.3.x', '1' => 'gemfiles/rails-3.0.x' },
      'env'     => { '0' => 'FOO=bar', '1' => 'FOO=baz' }
    })
    expected = {
      :rvm     => ['1.8.7', '1.9.2'],
      :gemfile => ['gemfiles/rails-2.3.x', 'gemfiles/rails-3.0.x'],
      :env     => ['FOO=bar', 'FOO=baz']
    }
    assert_equal expected, actual
  end
end
