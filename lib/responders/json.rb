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
        Travis::Api::Http.data(resource, controller.params, :version => version)
      end

      def version
        controller.controller_path.split('/').first || 'v1'
      end
  end
end
