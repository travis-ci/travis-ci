module Travis
  module Notifications
    class Worker
      class Payload
        attr_reader :task, :extra

        def initialize(task, extra = {})
          @task, @extra = task, extra
        end

        def to_hash
          render(:hash)
        end

        def render(format)
          Travis::Renderer.send(format, data, :type => :job, :template => template).first.deep_merge(extra) # TODO wtf is this an array??
        end

        def data
          { :task => task, :repository => task.repository }
        end

        def template
          task.class.name.underscore
        end
      end
    end
  end
end
