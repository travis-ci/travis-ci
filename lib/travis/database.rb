require 'active_record'
require 'logger'

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
        @logger ||= Logger.new('log/consumer.db.log')
      end

      def configurations
        @configurations ||=  YAML::load(IO.read('config/database.yml'))
      end

      def environment
        @environment ||= options[:env] || ENV['ENV'] || 'production'
      end
    end
  end
end
