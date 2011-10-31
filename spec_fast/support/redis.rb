require 'active_support/concern'
require 'fakeredis'

module Support
  module Redis
    extend ActiveSupport::Concern

    included do
      before :each do
        Resque.redis.flushall
      end
    end
  end
end
