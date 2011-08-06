module JsonHelpers
  # returns datetime objects as strings etc. more similar to what the client would see.
  def to_json(object, options = {})
    JSON.parse(object.as_json(options).to_json)
  end
end
