require 'travis'

TravisCi::Application.configure do
  # Settings specified here will take precedence over those in config/application.rb

  # The production environment is meant for finished, 'live' apps.
  # Code is not reloaded between requests
  config.cache_classes = true

  # Full error reports are disabled and caching is turned on
  config.consider_all_requests_local       = false
  config.action_controller.perform_caching = true

  # Specifies the header that your server uses for sending files
  #config.action_dispatch.x_sendfile_header = 'X-Sendfile'

  # For nginx:
  # config.action_dispatch.x_sendfile_header = 'X-Accel-Redirect'

  # If you have no front-end server that supports something like X-Sendfile,
  # just comment this out and Rails will serve the files

  config.log_level = :info
  config.colorize_logging = false

  # Use a different logger for distributed setups
  # config.logger = SyslogLogger.new

  # Use a different cache store in production
  # config.cache_store = :mem_cache_store

  # Disable Rails's static asset server
  # In production, Apache or nginx will already do this
  config.serve_static_assets = true

  # Compress JavaScripts and CSS
  config.assets.compress = false

  # Don't fallback to assets pipeline if a precompiled asset is missed
  config.assets.compile = false

  # Generate digests for assets URLs
  config.assets.digest = true

  # Hack so Rails doesn't complain about assets not being precompiled
  config.assets.digests = Class.new { def [](path) path end }.new
  config.action_controller.asset_host = "http://localhost:3001"
  config.assets.prefix = '12345'

  # Precompile the mobile stylesheet
  config.assets.precompile += [ 'mobile.css', 'mobile.js' ]

  config.action_mailer.default_url_options = {
    :host => Travis.config.host
  }

  # Disable delivery errors, bad email addresses will be ignored
  # config.action_mailer.raise_delivery_errors = false
  config.action_mailer.smtp_settings = {
    :address        => Travis.config.smtp.address,
    :port           => '25',
    :authentication => :cram_md5,
    :user_name      => Travis.config.smtp.user_name,
    :password       => Travis.config.smtp.password,
    :domain         => Travis.config.smtp.domain,
    :enable_starttls_auto => true
  }

  # Enable threaded mode
  # config.threadsafe!

  # Enable locale fallbacks for I18n (makes lookups for any locale fall back to
  # the I18n.default_locale when a translation can not be found)
  config.i18n.fallbacks = true

  # Send deprecation notices to registered listeners
  config.active_support.deprecation = :notify

  config.middleware.insert_before(::Rack::Lock, 'Refraction')
  config.lograge.enabled = true

  require 'notifications'

  config.after_initialize do
    Travis.logger.level = Logger::INFO
    ActionController::Base.logger = Travis.logger
    ActiveRecord::Base.logger = Travis.logger

  end

  require 'hubble'
  require 'hubble/middleware'
  Hubble.setup
  config.middleware.use "Hubble::Rescuer"
end
