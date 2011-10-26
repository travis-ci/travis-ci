ENV["RAILS_ENV"] ||= 'test'

RSpec.configure do |c|
  c.mock_with :mocha
end

require 'support/payloads'
