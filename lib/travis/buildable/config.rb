require 'uri'
require 'yaml'
require 'active_support/core_ext/hash/keys'

module Travis
  class Buildable
    class Config < Hash
      ENV_KEYS = ['rvm', 'gemfile', 'env']

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
    end
  end
end
