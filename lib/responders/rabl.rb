# This responder modifies the template lookup so that instead of the current
# controller action name the current resource name will be used as a template
# name.
#
# This is useful because we reuse Rabl templates in contexts outside of the
# controller context and it makes more sense to organize them by model names.
#
# Otherwise we'd end up with lots of show.rabl files in various subdirectories
# and the directory structure would be much less compact and easy to follow.
#
# E.g.:
#
# views/
#   v1/
#     default/
#       builds.rabl
#       build.rabl
#       repositories.rabl
#       repository.rabl

module Responders
  module Rabl
    VALID_XML_SCHEMAS = ['cctray']

    def to_format
      if schema = known_xml_schema
        render "repositories/show.#{schema}.xml.builder" # TODO port this to rabl
      elsif rabl_format?
        render :template => template_name, :locals => { :controller => controller, :params => controller.params }
      else
        super
      end
    end

    protected

      FORMATS = [:json, :xml]

      def rabl_format?
        FORMATS.include?(format)
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

      def known_xml_schema
        schema_key = controller.params[:schema].try(:downcase)
        schema_key if VALID_XML_SCHEMAS.include?(schema_key)
      end
  end
end
