require 'rubygems'
require 'spork'
require 'database_cleaner'
require 'jsonpath'
require 'mocha'

Spork.prefork do
  ENV["RAILS_ENV"] ||= "test"
  require File.expand_path(File.dirname(__FILE__) + '/../../config/environment')

  require 'cucumber/formatter/unicode' # Remove this line if you don't want Cucumber Unicode support
  require 'cucumber/rails/world'
  require 'cucumber/rails/active_record'
  require 'cucumber/web/tableish'


  require 'webrat'
  require 'webrat/core/matchers'

  Webrat.configure do |config|
    config.mode = :rack
    config.open_error_files = false # Set to true if you want error pages to pop up in the browser
  end
end

Spork.each_run do
  ActionController::Base.allow_rescue = false
  Cucumber::Rails::World.use_transactional_fixtures = true
  DatabaseCleaner.strategy = :truncation
end

Socky.module_eval do
  mattr_accessor :sent
  self.sent = []

  def self.send(data, options = {})
    sent << data
  end
end

Before do
  Nanite.stubs(:request)
  Socky.sent.clear
end
