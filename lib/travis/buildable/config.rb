require 'uri'
require 'yaml'
require 'active_support/core_ext/hash/keys'

module Travis
  class Buildable
    class Config < Hash
      ENV_KEYS = ['rvm', 'gemfile', 'env']

      class << self
        def matrix?(config)
          config.values_at(*ENV_KEYS).compact.any? { |value| value.is_a?(Array) }
        end
      end

      def initialize(source)
        config = File.read(source)
        replace(YAML.load(config).stringify_keys) rescue nil
      rescue Errno::ENOENT => e
        {}
      end

      def configure?
        self.class.matrix?(self)
      end
    end
  end
end
