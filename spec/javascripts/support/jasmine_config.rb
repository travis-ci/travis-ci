$: << 'lib'

require 'rubygems'
require 'yaml'
require 'webmock'

config = YAML.load_file('spec/javascripts/support/jasmine.yml')

WebMock.disable!
require 'selenium/webdriver'
# Patching for a bug in selenium webdriver that uses respond_to?
module Selenium
  module WebDriver
    if MultiJson.singleton_methods.include?('load')
      # @api private
      def self.json_load(obj)
        MultiJson.load(obj)
      end
    else
      # @api private
      def self.json_load(obj)
        MultiJson.decode(obj)
      end
    end
  end

  module Jasmine

    class Config
      # Add your overrides or custom config code here
    end

  end
end


# Note - this is necessary for rspec2, which has removed the backtrace
module Jasmine
  class SpecBuilder
    def declare_spec(parent, spec)
      me = self
      example_name = spec["name"]
      @spec_ids << spec["id"]
      backtrace = @example_locations[parent.description + " " + example_name]
      parent.it example_name, {} do
        me.report_spec(spec["id"])
      end
    end
  end
end
