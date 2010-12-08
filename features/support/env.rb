require 'rubygems'
require 'database_cleaner'
require 'jsonpath'
require 'mocha'

ENV["RAILS_ENV"] ||= "test"
require File.expand_path(File.dirname(__FILE__) + '/../../config/environment')

require 'cucumber/rails/world'
require 'cucumber/rails/active_record'
require 'cucumber/web/tableish'
require 'webrat'
require 'webrat/core/matchers'

Webrat.configure do |config|
  config.mode = :rack
  config.open_error_files = false # Set to true if you want error pages to pop up in the browser
end

ActionController::Base.allow_rescue = false
Cucumber::Rails::World.use_transactional_fixtures = true
DatabaseCleaner.strategy = :truncation

Socky.module_eval do
  mattr_accessor :sent
  self.sent = []

  def self.send(data, options = {})
    sent << data
  end
end

module Webrat::AssertSelectFix
  def assert_select(*args, &block)
    @response = response
    super
  end
end

World(Mocha::API)
World(Webrat::AssertSelectFix)

Before do
  Nanite.stubs(:request)
  Socky.sent.clear
  mocha_setup
end

After do
  begin
    mocha_verify
  ensure
    mocha_teardown
  end
end

