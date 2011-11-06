require 'logger'

STDOUT.sync = true

module Travis
  class LogFormatter < Logger::Formatter
    def call(severity, timestamp, progname, msg)
      "#{String === msg ? msg : msg.inspect}\n"
    end
  end

  class << self
    def logger
      @logger ||= Logger.new(STDOUT).tap do |logger|
        logger.formatter = LogFormatter.new
      end
    end

    def logger=(logger)
      @logger = logger
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

    def notice(message)
      "\e[33m#{message}\e[0m"
    end
  end
end
