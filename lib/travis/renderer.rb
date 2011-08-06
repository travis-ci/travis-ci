module Travis
  class Renderer
    class << self
      def hash(object, options = {})
        render(:hash, object, options)
      end

      def json(object, options = {})
        render(:json, object, options)
      end

      def xml(object, options = {})
        render(:json, object, options)
      end

      protected

        def render(format, object, options)
          set_instance_variable(object)
          view = Rabl::Engine.new(template(object, options), :format => format, :view_path => view_path(options)) # TODO view_path doesn't seem get passed through to :extends
          view.render(self, { :object => object })
        end

        def set_instance_variable(object)
          instance_variable_set(:"@#{model_name(object).split('/').last}", object)
        end

        def template(object, options)
          File.read(find_template(object, options)) # should use Tilt or ActionView (or internal classes) in order to cache things. or look into Rabl to support it there
        end

        def find_template(object, options)
          [options[:type], 'default'].compact.each do |type|
            path = template_path(object, options.merge(:type => type))
            return path if File.exists?(path)
          end
          raise "could not find rabl template for #{object.inspect} with #{options.inspect}"
        end

        def template_path(object, options)
          base = view_path(options)
          type = options.fetch(:type)
          name = options.fetch(:template, model_name(object))

          [base, type, "#{name}.rabl"].join('/')
        end

        def view_path(options)
          ['app/views', options.fetch(:version, 'v1')]
        end

        def model_name(object)
          item = object.is_a?(Array) ? object.first : object
          name = item.class.name.underscore
          object.is_a?(Array) ? name.pluralize : name
        end
    end
  end
end
