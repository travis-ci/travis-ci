module Travis
  module Notifications
    class Worker
      class Payload
        attr_reader :job, :extra

        def initialize(job, extra = {})
          @job, @extra = job, extra
        end

        def to_hash
          render(:hash)
        end

        def render(format)
          Travis::Renderer.send(format, data, :type => :job, :template => template).deep_merge(extra)
        end

        def data
          { :job => job, :repository => job.repository }
        end

        def template
          job.class.name.underscore
        end
      end
    end
  end
end
