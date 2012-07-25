require 'travis'
require 'notifications'
require 'hubble'
require 'hubble/middleware'
require 'action_controller_metrics_log_subscriber'
require 'travis/log_subscriber/active_record_metrics'

TravisCi::Application.configure do
  config.cache_classes = true
  config.consider_all_requests_local       = false
  config.action_controller.perform_caching = true

  config.action_mailer.default_url_options = {
    :host => Travis.config.host
  }

  config.action_mailer.smtp_settings = {
    :address        => Travis.config.smtp.address,
    :port           => '25',
    :authentication => :cram_md5,
    :user_name      => Travis.config.smtp.user_name,
    :password       => Travis.config.smtp.password,
    :domain         => Travis.config.smtp.domain,
    :enable_starttls_auto => true
  }

  config.i18n.fallbacks = false

  config.action_controller.asset_host = Travis.config.assets.host || 'travis-assets-staging.herokuapp.com'

  config.log_level = :info
  config.lograge.enabled = true
  config.colorize_logging = false
  config.active_support.deprecation = :notify

  config.after_initialize do
    Travis.logger.level = Logger::INFO
    ActionController::Base.logger = Travis.logger
    ActiveRecord::Base.logger = Travis.logger
    ActionControllerMetricsLogSubscriber.attach
    Travis::LogSubscriber::ActiveRecordMetrics.attach
  end

  config.middleware.insert_before(::Rack::Lock, 'Refraction')

  Hubble.setup
  options = { 'env' => Travis.env }
  options['codename'] = ENV['CODENAME'] if ENV.key?('CODENAME')
  config.middleware.use "Hubble::Rescuer", options
end
