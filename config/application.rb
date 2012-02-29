require File.expand_path('../boot', __FILE__)

require 'rails/all'
Bundler.require *Rails.groups(:assets) if defined?(Bundler)

module TravisCi
  class Application < Rails::Application
    config.encoding = 'utf-8'

    config.filter_parameters += [:password]

    config.assets.enabled = true
    config.assets.version = '1.0sc'
    config.serve_static_assets = true

    config.action_controller.page_cache_directory = root.join('tmp/assets')

    config.active_record.default_timezone = :utc

    ActiveRecord::Base.include_root_in_json = false

    config.middleware.use Rack::JSONP
  end
end
