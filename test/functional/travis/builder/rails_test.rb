require 'test_helper'
require 'travis/builder'
require 'travis/builder/rails'

class TravisBuilderRailsTest < ActiveSupport::TestCase
  class Builder < Travis::Builder
    include Travis::Builder::Rails
  end

  attr_reader :now, :builder, :rails

  def setup
    super
    @now = Time.now
    Time.stubs(:now).returns(now)

    @builder = Builder.new('12345', 'build' => { 'id' => 1 }, 'repository' => { 'id' => 1 })
    builder.stubs(:buildable).returns(Mocks::Buildable.new)
    builder.stubs(:http).returns(Mocks::EmHttpRequest.new)
  end

  def work!
    EM.run do
      EM.defer do
        builder.work!
        sleep(0.1) until builder.messages.empty? && builder.connections.empty?
        EM.stop
      end
      EM.add_timer(2) { EM.stop }
    end
  end

  # FIXME not sure what's wrong with this test. should pass
  # test 'updates the build record on start and on finish' do
  #   work!
  #   assert_equal [:post, { :body => { '_method' => 'put', 'msg_id' => 1, 'build' => { 'started_at'  => Time.now } }, :head => { 'authorization' => [nil, nil] } }], builder.http.requests[0]
  #   assert_equal [:post, { :body => { '_method' => 'put', 'msg_id' => 2, 'build' => { 'finished_at' => Time.now, 'log' => '', 'status' => nil } }, :head => { 'authorization' => [nil, nil] } }], builder.http.requests[1]
  # end
end

