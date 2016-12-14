require 'tilt'
require 'json'

class EmberHandlebars < Tilt::Template
  def self.default_mime_type
    "application/javascript"
  end

  def prepare
  end

  def evaluate(scope, locals, &block)
    "Ember.TEMPLATES['#{scope.logical_path}'] = Ember.Handlebars.compile(#{data.to_json})"
  end
end
