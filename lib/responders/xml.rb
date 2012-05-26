module Responders
  module Xml
    VALID_XML_SCHEMAS = ['cctray']

    def to_format
      if xml? && schema = xml_schema
        render "repositories/show.#{schema}"
      else
        super
      end
    end

    protected

      def xml?
        format.to_s == 'xml'
      end

      def xml_schema
        schema_key = controller.params[:schema].try(:downcase)
        schema_key if VALID_XML_SCHEMAS.include?(schema_key)
      end
  end
end
