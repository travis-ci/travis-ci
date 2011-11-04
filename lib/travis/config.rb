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
            :workers => { :heartbeat => 10 }

    default :_access => [:key]

    def initialize(data = nil, *args)
      data ||= self.class.load_env || self.class.load_file || {}
      super
    end
  end
end
