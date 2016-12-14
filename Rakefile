#!/usr/bin/env rake

require File.expand_path('../config/application', __FILE__)

ENV['SCHEMA'] = "#{Gem.loaded_specs['travis-core'].full_gem_path}/db/schema.rb"

module ::TravisCi
  class Application
      include Rake::DSL
  end
end

module ::RakeFileUtils
  extend Rake::FileUtilsExt
end

TravisCi::Application.load_tasks

class Rake::Application
  def delete(name)
    @tasks.delete(name)
  end
end

Rake.application.delete('assets:precompile')
