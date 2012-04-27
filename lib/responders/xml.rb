module Responders
  module Xml
    VALID_XML_SCHEMAS = ['cctray']

    def to_format
      if xml_schema = self.xml_schema
        render "repositories/show.#{xml_schema}", :format => :xml
      else
        super
      end
    end

    protected

      def xml_schema
        schema_key = controller.params[:schema].try(:downcase)
        schema_key if VALID_XML_SCHEMAS.include?(schema_key)
      end
  end
end
