require 'active_support/concern'
require 'support/mocks/pusher'

module Support
  module Pusher
    extend ActiveSupport::Concern

    attr_reader :pusher

    included do
      before :each do
        @pusher = Support::Mocks::Pusher.new
        Travis::Notifications::Pusher.any_instance.stubs(:channel).returns(pusher)
      end
    end
  end
end
