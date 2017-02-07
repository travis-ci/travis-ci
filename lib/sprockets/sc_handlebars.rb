require 'tilt'
require 'json'

class ScHandlebars < Tilt::Template
  def self.default_mime_type
    "application/javascript"
  end

  def prepare
  end

  def evaluate(scope, locals, &block)
    "SC.TEMPLATES['#{scope.logical_path}'] = SC.Handlebars.compile(#{data.to_json})"
  end
end
