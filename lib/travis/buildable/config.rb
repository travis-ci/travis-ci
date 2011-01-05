require 'uri'
require 'net/http'
require 'net/https'
require 'yaml'
require 'active_support/core_ext/hash/keys'

module Travis
  class Buildable
    class Config < Hash
      def initialize(source)
        source = URI.parse(source)

        http = Net::HTTP.new(source.host, 443)
        http.use_ssl = true

        response, body = http.get(source.path, nil)
        replace(YAML.load(body).symbolize_keys) rescue nil if response.code == '200'
      rescue URI::InvalidURIError => e
        {}
      end
    end
  end
end
