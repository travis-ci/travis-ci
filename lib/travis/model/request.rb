require 'simple_states'
require 'active_support/core_ext/module/delegation'

module Travis
  module Model
    class Request
      autoload :Branches, 'travis/model/request/branches'

      module Payload
        autoload :Github, 'travis/model/request/payload/github'
      end

      class << self
        def create(payload, token)
          payload = Payload::Github.new(payload, token)
          new(::Request.create_from(payload)) unless payload.reject?
        end

        def find(id)
          new(::Request.find(id))
        end
      end

      include SimpleStates, Branches

      states :created, :started, :finished
      event :start,     :to => :started
      event :configure, :to => :configured, :after => :finish, :if => :approved?
      event :finish,    :to => :finished

      delegate :state, :state=, :configure, :to => :record

      attr_reader :record

      def initialize(record)
        @record = record
      end

      def approved?
        branch_included? && !branch_excluded?
      end
    end
  end
end
