require File.expand_path('../boot', __FILE__)

require 'rails/all'
Bundler.require *Rails.groups(:assets) if defined?(Bundler)

# require 'oauth_proxy'
# @rkh why don't we just add /lib to the load path here?
require File.expand_path('../../lib/oauth_proxy', __FILE__) # FIXME: WTF???

module TravisCi
  class Application < Rails::Application
    config.encoding = 'utf-8'

    config.filter_parameters += [:password]

    config.assets.enabled = false
    config.serve_static_assets = true
    config.action_controller.asset_path = lambda { |path| "/#{Travis.config.assets.version}#{path}" }

    config.action_controller.page_cache_directory = root.join('tmp/assets')

    config.active_record.default_timezone = :utc

    ActiveRecord::Base.include_root_in_json = false

    config.i18n.default_locale = :en
    config.i18n.load_path += Dir[Rails.root.join('locales', '*.{rb,yml}').to_s]

    config.middleware.use Rack::JSONP
    config.middleware.use OauthProxy, '/oauth_dummy', 'https://api.travis-ci.org/'

    # make sure Rails reloads/re-requires the model slices on
    # each page load during development
    # thanks to Ryan Bigg for this advice
    config.to_prepare do
      Dir[File.expand_path('../../app/models/*_slice.rb', __FILE__)].each do |file|
        Rails.configuration.cache_classes ? require(file) : load(file)
      end
    end
  end
end
