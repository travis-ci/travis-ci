module Travis
  class Renderer
    class << self
      def json(object, options = {})
        set_instance_variable(object)
        view = Rabl::Engine.new(template(object, options), :format => 'json')
        view.render(self, {})
      end

      protected

        def set_instance_variable(object)
          name = object.is_a?(Array) ? model_name(object).pluralize : model_name(object)
          instance_variable_set(:"@#{name}", object)
        end

        def template(object, options)
          File.read(template_path(object, options)) # should use ActionView (or internal classes) in order to cache things
        end

        def template_path(object, options)
          version = options.fetch(:version, 'v1')
          type    = options.fetch(:type, 'http')
          dir     = options.fetch(:model, model_name(object).pluralize)
          name    = options.fetch(:name, template_name(object))

          ['app/views', version, type, dir, name].join('/')
        end

        def model_name(object)
          (object.is_a?(Array) ? object.first : object).class.name.underscore
        end

        def template_name(object)
          "#{object.is_a?(Array) ? 'index' : 'show'}.rabl"
        end
    end
  end
end
