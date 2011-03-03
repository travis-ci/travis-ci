# Serve compass from the tmp directory
require 'fileutils'
FileUtils.mkdir_p(Rails.root.join('tmp', 'stylesheets'))
TravisRails::Application.config.middleware.insert_before(
  'Rack::Sendfile',
  'Rack::Static',
  :root => "#{Rails.root}/tmp",
  :urls => ['/stylesheets']
)

# Initialize compass
require 'compass'
require 'compass/app_integration/rails'
Compass::AppIntegration::Rails.initialize!
