class HandlebarsTemplate < Tilt::Template
  def self.default_mime_type
    "application/javascript"
  end

  def prepare
  end

  def evaluate(scope, locals, &block)
    "Handlebars.compile(#{data.to_json})"
  end
end

Rails.application.assets.register_engine '.hbs', HandlebarsTemplate