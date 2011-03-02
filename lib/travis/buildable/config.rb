require 'uri'
require 'yaml'
require 'active_support/core_ext/hash/keys'

module Travis
  class Buildable
    class Config < Hash
      CONFIGURABLES = [:matrix]

      def initialize(source)
        config = File.read(source)
        replace(YAML.load(config).symbolize_keys) rescue nil
      rescue Errno::ENOENT => e
        {}
      end

      def configure?
        !values_at(*CONFIGURABLES).compact.empty?
      end
    end
  end
end
