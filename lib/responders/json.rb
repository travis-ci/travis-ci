module Responders
  module Json
    def to_format
      if json?
        render json: json
      else
        super
      end
    end

    protected

      def json?
        format.to_sym == :json
      end

      def json
        Travis::Api.data(resource, params: controller.params, version: version)
      end

      def version
        controller.controller_path =~ /^V[\d]+::/ && $1 || 'v1'
      end
  end
end
