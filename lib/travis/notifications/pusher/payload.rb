module Travis
  module Notifications
    class Pusher
      class Payload
        attr_reader :event, :object, :extra

        def initialize(event, object, extra = {})
          @event, @object, @extra = event, object, extra
        end

        def to_hash
          render(:hash)
        end

        def render(format)
          Travis::Renderer.send(format, data, :type => :event, :template => template).deep_merge(extra)
        end

        def data
          { :build => object, :repository => object.repository }
        end

        def template
          event.to_s.split(':').join('/')
        end
      end
    end
  end
end
