require 'hashr'
require 'yaml'

module Travis
  class Config < Hashr
    module Pusher
      def key
        self[:key]
      end
    end

    define :notifications => []
    define :queues => []
    define :pusher => Pusher

    def initialize(data = nil, *args)
      data ||= load_env || load_file || {}
      super
    end

    def load_env
      YAML.load(ENV['travis_config']) if ENV['travis_config']
    end

    def load_file
      YAML.load_file(filename)[environment] if File.exists?(filename)
    end

    def filename
      @filename = File.expand_path('../../../config/travis.yml', __FILE__)
    end

    def environment
      defined?(Rails) ? Rails.env : 'test'
    end
  end
end
