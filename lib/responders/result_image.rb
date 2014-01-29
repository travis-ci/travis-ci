module Responders
  module ResultImage
    STATUS_NAMES = { default: 'unknown', passed: 'passing', failed: 'failing' }

    delegate :params, :headers, :send_file, :to => :controller

    def to_format
      if matches?
        send_result_image
      else
        super
      end
    end

    protected

      def matches?
        params[:action] == 'show' && format == :png
      end

      def send_result_image
        headers['Expires'] = CGI.rfc1123_date(Time.now.utc)
        send_file(path, :type => 'image/png', :disposition => 'inline')
      end

      def path
        Rails.root.join("public/images/result/#{result}.png").to_s
      end

      def result
        result = resource ? resource.builds.last_state_on(controller.params) : nil
        STATUS_NAMES[result] || STATUS_NAMES[:default]
      end
  end
end
