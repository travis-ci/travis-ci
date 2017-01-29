module Responders
  module StatusImage
    STATUS_NAMES = { nil => 'unknown', 0 => 'passing', 1 => 'failing' }

    delegate :params, :headers, :send_file, :to => :controller

    def to_format
      if matches?
        send_status_image
      else
        super
      end
    end

    protected

      def matches?
        params[:action] == 'show' && format == :png
      end

      def send_status_image
        headers['Expires'] = CGI.rfc1123_date(Time.now)
        send_file(path, :type => 'image/png', :disposition => 'inline')
      end

      def path
        Rails.root.join("app/assets/images/status/#{status}.png").to_s
      end

      def status
        STATUS_NAMES[resource.try(:last_build_status, controller.params)]
      end
  end
end
