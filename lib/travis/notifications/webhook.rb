module Travis
  module Notifications
    class Webhook
      EVENTS = 'build:finished'

      cattr_accessor :http_client

      self.http_client = Faraday.new do |f|
        f.request :url_encoded
        f.adapter :net_http
      end

      def notify(event, build, *args)
        send_webhook_notifications(build) if build.send_webhook_notifications?
      end

      protected

        def send_webhook_notifications(build)
          build.webhooks.each do |webhook|
            self.class.http_client.post(webhook) do |req|
              req.body = { :payload => build.to_json(:for => :webhook) }
              req.headers['Authorization'] = authorization(build)
            end
          end
        end

        # def http_adapter
        #   Faraday.new do |f|
        #     f.request :url_encoded
        #     f.adapter :net_http
        #   end
        # end

        def authorization(build)
          Digest::SHA2.hexdigest(build.repository.slug + build.request.token)
        end
    end
  end
end
