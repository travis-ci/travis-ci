require 'logger'

STDOUT.sync = true

module Travis
  class LogFormatter < Logger::Formatter
    def call(severity, timestamp, progname, msg)
      "[#{Thread.current.object_id}] #{String === msg ? msg : msg.inspect}\n"
    end
  end

  def self.logger
    @logger ||= Logger.new(STDOUT).tap do |logger|
      logger.formatter = LogFormatter.new
    end
  end

  module Logging
    def self.included(base)
      base.extend(self)
    end

    def log(*args)
      logger.info(*args)
      STDOUT.flush
    end

    def logger
      Travis.logger
    end
  end
end
