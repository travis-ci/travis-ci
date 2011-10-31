require 'active_record'
require 'pg'
require 'logger'
require 'database_cleaner'
require 'support/factories'

ActiveRecord::Base.logger = Logger.new('log/test.db.log')
ActiveRecord::Base.configurations = YAML::load(IO.read('config/database.yml'))
ActiveRecord::Base.establish_connection('test')

DatabaseCleaner.strategy = :truncation
DatabaseCleaner.clean_with :truncation

module Support
  module ActiveRecord
    extend ActiveSupport::Concern

    included do
      before :each do
        DatabaseCleaner.start
      end

      after :each do
        DatabaseCleaner.clean
      end
    end
  end
end
