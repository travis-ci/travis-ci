require 'yaml'

module Travis
  class Config < Hash
    def initialize
      replace(load_env || load_file || {})
    end

    def load_env
      YAML.load(ENV['travis_config']) if ENV['travis_config']
    end

    def load_file
      file = File.expand_path('../../../config/travis.yml', __FILE__)
      YAML.load_file(file)[environment] if File.exists?(file)
    end

    def environment
      defined?(Rails) ? Rails.env : 'test'
    end
  end
end
