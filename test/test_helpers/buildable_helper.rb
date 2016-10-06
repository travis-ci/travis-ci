require 'tempfile'

module TestHelper
  module Buildable
    def config(config = nil)
      Travis::Buildable::Config.new(config_file(config).path)
    end

    def config_file(config = nil)
      Tempfile.new("travis.yml").tap do |file|
        file.write(YAML.dump(config || { :script => 'rake ci' }))
        file.flush
      end
    end
  end
end
