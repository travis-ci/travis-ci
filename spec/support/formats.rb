module Support
  module Formats
    # normalizes datetime objects to strings etc. more similar to what the client would see.
    def normalize_json(json)
      json = json.to_json unless json.is_a?(String)
      JSON.parse(json)
    end
  end
end
