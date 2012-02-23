require 'metriks/reporter/logger'

reporter = Metriks::Reporter::Logger.new :logger => Rails.logger, :interval => 5
reporter.start
