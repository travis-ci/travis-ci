require 'metriks/reporter/logger'
require 'remote_syslog_logger'
logger = RemoteSyslogLogger.new(ENV['SYSLOG_HOST'], ENV['SYSLOG_PORT'])
$reporter = Metriks::Reporter::Logger.new :logger => logger, :interval => 5
$reporter.start
Metriks.counter("starts").increment
