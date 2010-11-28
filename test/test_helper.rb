ENV["RAILS_ENV"] = "test"
require File.expand_path('../../config/environment', __FILE__)

require 'test/unit'
require 'test_declarative'
require 'database_cleaner'
require 'ruby-debug'
require 'factories'

DatabaseCleaner.strategy = :truncation

class Test::Unit::TestCase
  def teardown
    DatabaseCleaner.clean
  end
end

# {"repository":{"uri":"http://github.com/svenfuchs/i18n","owner":{"name":"svenfuchs","email":"svenfuchs@artweb-design.de"}},"after":"5911413de86b53e29854","ref":"refs/heads/master","commits":[{"added":["lib/i18n/version.rb"],"timestamp":"2010-11-18T14:57:17+02:00","author":{"name":"svenfuchs","email":"svenfuchs@artweb-design.de"},"uri":"http://github.com/svenfuchs/i18n/commit/5911413de86b53e29854","id":"5911413de86b53e29854","message":"bump to 0.5.0beta3"}],"before":"674b59a226bf6f1c8210"}
