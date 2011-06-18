require File.expand_path('../boot', __FILE__)

require 'rails/all'
Bundler.require(:default, Rails.env) if defined?(Bundler)

module TravisCi
  class Application < Rails::Application
    GIT_SHA = `git rev-parse HEAD`.chomp

    config.autoload_paths << config.paths.app.views.to_a.first
    config.encoding = "utf-8"
    config.filter_parameters += [:password]

    # config.action_controller.logger = Logger.new(STDOUT)
    config.serve_static_assets = true
    config.action_controller.page_cache_directory = root.join('tmp/assets')

    config.active_record.default_timezone = :utc

    ActiveRecord::Base.include_root_in_json = false
  end
end
