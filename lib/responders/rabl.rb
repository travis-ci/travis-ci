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
    def to_format
      if rabl_format?
        render :template => template_name
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
        collection? ? singular_resource_name.pluralize : singular_resource_name
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
