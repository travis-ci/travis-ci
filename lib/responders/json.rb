module Responders
  module Json
    def to_format
      if json?
        render :json => renderer(controller.params).data
      else
        super
      end
    end

    protected

      def json?
        format.to_sym == :json
      end

      def renderer(options = {})
        "Travis::Api::Json::Http::#{type}".constantize.new(resource, options)
      end

      def type
        collection? ? resource.first.class.name.pluralize : resource.class.name
      end

      def template_name
        if collection? && resource.first.nil?
          'empty'
        else
          collection? ? singular_resource_name.pluralize : singular_resource_name
        end
      end

      def singular_resource_name
        item = collection? ? resource.first : resource
        item.class.name.underscore
      end

      def collection?
        resource.respond_to?(:slice)
      end
  end
end
