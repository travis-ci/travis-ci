require File.expand_path('../boot', __FILE__)

require 'rails/all'
Bundler.require(:default, Rails.env) if defined?(Bundler)

module TravisRails
  class Application < Rails::Application
    config.autoload_paths << config.paths.app.views.to_a.first
    config.action_view.javascript_expansions = {
      :jasmine => %w(tests/vendor/jasmine tests/vendor/jasmine-html)
    }

    config.encoding = "utf-8"
    config.filter_parameters += [:password]

    # config.action_controller.logger = Logger.new(STDOUT)
    config.serve_static_assets = true

    ActiveRecord::Base.include_root_in_json = false
  end
end
