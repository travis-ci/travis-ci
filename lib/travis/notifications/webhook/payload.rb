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
          Travis::Renderer.send(format, object, :type => :webhook, :template => template, :base_dir => base_dir)
        end

        def template
          object.class.name.underscore
        end

        def base_dir
          File.expand_path('../views', __FILE__)
        end
      end
    end
  end
end

