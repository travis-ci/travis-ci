require 'travis/api'

module Support
  module Formats
    def json_response
      response = respond_to?(:last_response) ? last_response : self.response
      ActiveSupport::JSON.decode(response.body)
    end

    def xml_response
      response = respond_to?(:last_response) ? last_response : self.response
      ActiveSupport::XmlMini.parse(response.body)
    end

    def json_for_http(object, options = {})
      type = object.respond_to?(:slice) ? object.first.class.name.pluralize : object.class.name
      "Travis::Api::Json::Http::#{type}".constantize.new(object, options).data
    end

    def json_for_pusher(event, object)
      normalize_json(Travis::Notifications::Handler::Pusher::Payload.new(event, object).to_hash)
    end

    def json_for_webhook(object)
      normalize_json(Travis::Notifications::Handler::Webhook::Payload.new(object).to_hash)
    end

    def json_for_worker(object)
      normalize_json(Travis::Notifications::Handler::Worker::Payload.new(object).to_hash)
    end

    # normalizes datetime objects to strings etc. more similar to what the client would see.
    def normalize_json(json)
      json = json.to_json unless json.is_a?(String)
      ActiveSupport::JSON.decode(json)
    end
  end
end
