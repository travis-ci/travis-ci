require 'active_record'
require 'fileutils'
require 'logger'
require 'erb'

module Travis
  module Database
    class << self
      attr_reader :options

      def connect(options = {})
        @options = options

        ActiveRecord::Base.logger = logger
        ActiveRecord::Base.configurations = configurations
        ActiveRecord::Base.establish_connection(environment)
      end

      def logger
        @logger ||= begin
          FileUtils.mkdir_p('log') # TODO log/ is in git but it's not on heroku?
          Logger.new('log/consumer.db.log')
        end
      end

      def configurations
        @configurations ||=  YAML::load(ERB.new(File.read('config/database.yml')).result)
      end

      def environment
        @environment ||= options[:env] || ENV['ENV'] || 'production'
      end
    end
  end
end
