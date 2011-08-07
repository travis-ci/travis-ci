module TestHelpers
  module Json
    def render_json(object, options = {})
      normalize_json(Travis.json(object, options))
    end

    # normalizes datetime objects to strings etc. more similar to what the client would see.
    def normalize_json(json)
      json = json.to_json unless json.is_a?(String)
      JSON.parse(json)
    end
  end
end
