module Travis
  module Notifications
    class Webhook
      def self.notify(build)
        new.notify(build)
      end

      def notify(build)
        webhooks = Array(build.config['notifications']['webhooks']).reject { |wh| wh.blank? }
        webhooks.each do |webhook|
          http_adapter.post webhook do |req|
           req.body = { :payload => build.as_json.to_json }
          end
        end
      end

      def http_adapter
        Faraday.new do |b|
          b.request :url_encoded
          b.adapter :net_http
        end
      end
    end

    register_notifier(self)
  end
end
