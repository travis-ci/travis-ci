$: << 'lib'

require 'rubygems'
require 'yaml'
require 'fileutils'
require 'sprockets'
require 'sprockets/ember_handlebars'
require 'webmock'

# build up asset pipeline - notices some funkies in the gem for asset_pipeline. Have to have a look at that..
sprockets = Sprockets::Environment.new
sprockets.cache = Sprockets::Cache::FileStore.new('tmp/cache')

sprockets.append_path 'app/assets/javascripts'
sprockets.register_engine 'hjs', EmberHandlebars

FileUtils.mkdir_p('tmp/jasmine')

config = YAML.load_file('spec/javascripts/support/jasmine.yml')
config['assets'].each do |asset|
  File.open("tmp/jasmine/#{asset}", 'w+') { |f| f.write(sprockets[asset]) }
end

WebMock.disable!

module Jasmine

  class Config
    # Add your overrides or custom config code here
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
