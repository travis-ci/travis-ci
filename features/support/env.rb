ENV["RAILS_ENV"] ||= "cucumber"

require File.expand_path(File.dirname(__FILE__) + '/../../config/environment')
require 'steam'
require 'mocha'
require 'ruby-debug'
require 'database_cleaner'

Steam.config[:html_unit][:java_path] = File.expand_path('../../../vendor/htmlunit/2.8', __FILE__)
DatabaseCleaner.strategy = :truncation

browser = Steam::Browser.create
World do
  Steam::Session::Rails3.new(browser)
end

module SelectorAssertionsFix
  def response_from_page_or_rjs
    @response = response
    super
  end
end

World(Mocha::API)
World(ActionDispatch::Assertions::TagAssertions)
World(ActionDispatch::Assertions::SelectorAssertions)
World(SelectorAssertionsFix)

Before do
  DatabaseCleaner.start
  mocha_setup
end

After do
  DatabaseCleaner.clean
  begin
    mocha_verify
  ensure
    mocha_teardown
  end
end


at_exit { browser.close }

