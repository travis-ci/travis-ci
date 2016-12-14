#!/usr/bin/env rake

require File.expand_path('../config/application', __FILE__)

module ::TravisCi
  class Application
      include Rake::DSL
  end
end

module ::RakeFileUtils
  extend Rake::FileUtilsExt
end

TravisCi::Application.load_tasks
