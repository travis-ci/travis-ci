require 'simple_states'
require 'active_support/core_ext/module/delegation'

module Travis
  class Model
    class Request < Model
      autoload :Branches, 'travis/model/request/branches'

      module Payload
        autoload :Github, 'travis/model/request/payload/github'
      end

      class << self
        def create(payload)
          payload = Payload::Github.new(payload)
          new(::Request.create_from(payload)) unless payload.reject?
        end

        def find(id)
          new(::Request.find(id))
        end
      end

      include SimpleStates, Branches

      states :created, :started, :finished
      event :start,     :to => :started
      event :configure, :to => :configured, :after => :finish
      event :finish,    :to => :finished

      delegate :state, :state=, :config, :configure, :to => :record

      def approved?
        branch_included?(record.commit.branch) && !branch_excluded?(record.commit.branch)
      end

      def build
        @build ||= Build.new(record.build)
      end

      def configure(data)
        if approved?
          record.configure(data)
          build.matrix.each { |job| Job.new(job).notify(:create) }
        end
      end
    end
  end
end
