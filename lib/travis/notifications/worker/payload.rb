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
          Travis::Renderer.send(format, data, :type => 'worker', :template => template, :base_dir => base_dir).deep_merge(extra)
        end

        def data
          { :job => job, :repository => job.repository }
        end

        def template
          job.class.name.underscore
        end

        def base_dir
          File.expand_path('../views', __FILE__)
        end
      end
    end
  end
end
