require 'metriks/reporter/logger'
require 'remote_syslog_logger'

if Rails.env.production?
  $metriks_reporter = Metriks::Reporter::Logger.new
end
