require 'hashr'
require 'yaml'

module Travis
  class Config < Hashr
    class << self
      def load_env
        YAML.load(ENV['travis_config']) if ENV['travis_config']
      end

      def load_file
        YAML.load_file(filename)[environment] if File.exists?(filename)
      end

      def filename
        @filename ||= File.expand_path('../../../config/travis.yml', __FILE__)
      end

      def environment
        defined?(Rails) ? Rails.env : 'test'
      end
    end

    define  :amqp  => { :host => '127.0.0.1', :prefetch => 1 },
            :host => 'http://travis-ci.org',
            :notifications => [],
            :queues  => [],
            :workers => { :prune => { :after => 10, :interval => 10 } },
            :jobs    => { :retry => { :after => 60 * 60 * 2, :max_attempts => 1, :interval => 60 * 5 } }

    default :_access => [:key]

    def initialize(data = nil, *args)
      data ||= self.class.load_env || self.class.load_file || {}
      super
    end
  end
end
