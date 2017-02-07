module Travis
  module Notifications
    class Webhook
      class Payload
        attr_reader :object

        def initialize(object)
          @object = object
        end

        def to_hash
          render(:hash)
        end

        def render(format)
          Travis::Renderer.send(format, object, :type => :webhook, :template => template)
        end

        def template
          object.class.name.underscore
        end
      end
    end
  end
end

