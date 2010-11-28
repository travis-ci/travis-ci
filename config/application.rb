require File.expand_path('../boot', __FILE__)

require 'rails/all'
Bundler.require(:default, Rails.env) if defined?(Bundler)

module TravisRails
  class Application < Rails::Application
    config.autoload_paths << config.paths.app.views.to_a.first
    config.action_view.javascript_expansions[:defaults] = %w(jquery-1.4.4.min.js jquery-ui-1.8.6.min.js rails)

    config.encoding = "utf-8"
    config.filter_parameters += [:password]
  end
end
