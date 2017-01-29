module Travis
  class Renderer
    class << self
      def hash(object, options = {})
        new(:hash, object, options).render
      end

      def json(object, options = {})
        new(:json, object, options).render
      end

      def xml(object, options = {})
        new(:xml, object, options).render
      end
    end

    attr_reader :format, :object, :options, :version, :type, :template_name

    def initialize(format, object, options = {})
      @format, @object, @options = format, object, options

      @version = options.fetch(:version, :v1)
      @type    = options.fetch(:type, :default)
      @template_name = options.fetch(:template, model_name)
    end

    def render
      set_instance_variable
      view = Rabl::Engine.new(template, :format => format) # :view_path => view_path(options) TODO view_path doesn't seem get passed through to :extends
      view.singleton_class.send(:attr_accessor, :params) # omg. essentially need this for a test helper? is there no way to pass locals in?
      view.params = options[:params] || {}
      view.render(self, {})
    end

    protected

      def set_instance_variable
        instance_variable_set(:"@#{model_name.split('/').first}", object)
      end

      def template
        File.read(find_template) # should use Tilt or ActionView (or internal classes) in order to cache things. or look into Rabl to support it there
      end

      def find_template
        template_paths.detect { |path| File.exists?(path) } || raise_template_not_found
      end

      def template_paths
        [type, 'default'].compact.map { |type| template_path(type) }
      end

      def template_path(type)
        [view_path, type, "#{template_name}.rabl"].join('/')
      end

      def view_path
        ['app/views', version]
      end

      def model_name
        @model_name = begin
          item = collection? ? object.first : object
          name = item.class.name.underscore
          collection? ? name.pluralize : name
        end
      end

      def raise_template_not_found
        raise "could not find rabl template for #{object.class.name} with #{options.inspect}"
      end
      
      def collection?
        object.is_a?(Array) || (object.is_a?(ActiveRecord::Relation) && object.respond_to?(:slice))
      end
      
  end
end
