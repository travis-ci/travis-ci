require 'active_record'
require 'erb'

module Travis
  module Database
    class << self
      attr_reader :options

      def connect(options = {})
        @options = options

        ActiveRecord::Base.default_timezone = :utc
        ActiveRecord::Base.logger = Travis.logger
        ActiveRecord::Base.configurations = configurations
        ActiveRecord::Base.establish_connection(environment)
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
