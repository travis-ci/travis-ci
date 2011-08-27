module Responders
  module StatusImage
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
        "#{Rails.public_path}/images/status/#{status}.png"
      end

      def status
        @status = begin
          resource.override_last_finished_build_status!(controller.params) if resource.respond_to?(:override_last_finished_build_status)
          resource.blank? ? Repository::STATUSES[nil] : resource.last_finished_build_status_name
        end
      end
  end
end
