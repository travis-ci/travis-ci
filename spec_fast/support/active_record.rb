require 'active_record'
require 'pg'
require 'logger'
require 'database_cleaner'

ActiveRecord::Base.logger = Logger.new('log/test.db.log')
ActiveRecord::Base.configurations = YAML::load(IO.read('config/database.yml'))
ActiveRecord::Base.establish_connection('test')

RSpec.configure do |c|
  c.before :suite do
    DatabaseCleaner.strategy = :truncation
    DatabaseCleaner.clean_with :truncation
  end

  c.before :each do
    DatabaseCleaner.start
  end

  c.after :each do
    DatabaseCleaner.clean
  end
end
