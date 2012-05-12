module Responders
  module Json
    def to_format
      if json?
        render :json => data
      else
        super
      end
    end

    protected

      def json?
        format.to_sym == :json
      end

      def data
        collection? && resource.empty? ? [] : build
      end

      def renderer(options = {})
        Travis::Api::Http.data(type, resource, controller.params, :version => version)
      end

      def version
        'v1' # TODO how to specify the version?
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
