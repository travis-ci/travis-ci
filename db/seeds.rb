# encoding: utf-8
# truncate all tables for test and development

# TODO: This is the wrong place for seed data, for now
#       it has been commented out, but this needs a new home
require 'factory_girl'
require 'forgery'
Dir["#{Rails.root}/lib/forgery/forgeries/*.rb"].each {|f| require f}
require "#{Rails.root}/spec/support/forged_factories.rb"

if Rails.env.development? || Rails.env.jasmine?
  ActiveRecord::Base.connection.tables.each do |table|
    ActiveRecord::Base.connection.execute("TRUNCATE #{table}") if table != "schema_migrations"
  end

  10.times do
    Factory.create(:seed_repository)
  end
end
