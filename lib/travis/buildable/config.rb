require 'uri'
require 'yaml'
require 'active_support/core_ext/hash/keys'

module Travis
  class Buildable
    class Config < Hash
      ENV_KEYS = ['rvm', 'gemfile', 'env', 'before_script', 'script', 'after_script']

      class << self
        def matrix?(config)
          config.values_at(*ENV_KEYS).compact.any? { |value| value.is_a?(Array) && value.size > 1 }
        end
      end

      def initialize(config)
        config = YAML.load(File.read(config)) rescue {} if config.is_a?(String)
        replace(config.stringify_keys)
      rescue Errno::ENOENT => e
        {}
      end

      def configure?
        self.class.matrix?(self)
      end

      def gemfile
        File.expand_path((self['gemfile'] || 'Gemfile').to_s)
      end
      
      def before_script
        self['before_script']
      end

      def script
        self['script'] || if File.exists?(gemfile)
          'bundle exec rake'
        else
          'rake'
        end
      end
      
      def after_script
        self['after_script']
      end
    end
  end
end
