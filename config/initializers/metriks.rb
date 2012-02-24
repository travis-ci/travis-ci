require 'metriks/reporter/logger'

if Rails.env.production?
  $metriks_reporter = Metriks::Reporter::Logger.new
end
