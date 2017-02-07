module Support
  module Pusher
    extend ActiveSupport::Concern

    included do
      before :each do
        Travis::Notifications::Pusher.any_instance.stubs(:channel).returns(pusher)
      end
    end

    def pusher
      @pusher ||= Support::Mocks::Pusher.new
    end
  end
end


