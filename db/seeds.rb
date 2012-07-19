# encoding: utf-8

unless Rails.env.production?
  connection = ActiveRecord::Base.connection
  connection.tables.each do |table|
    connection.execute("TRUNCATE #{table}") unless table == "schema_migrations"
  end

  sql = File.read('db/seeds/data.sql')
  connection.execute(sql)
end

# require 'factory_girl'
# require 'forgery'
# Dir["#{Rails.root}/lib/forgery/forgeries/*.rb"].each {|f| require f}
# Dir["#{Rails.root}/spec/support/factories/*.rb"].each {|f| require f}
#
# Travis.config.notifications = []
#
# if Rails.env.development?
#   ActiveRecord::Base.connection.tables.each do |table|
#     ActiveRecord::Base.connection.execute("TRUNCATE #{table}") if table != "schema_migrations"
#   end
#
#   [Repository, Commit, Request, Build].each{ |klass| klass.reset_column_information }
#
#   10.times do
#     repository = FactoryGirl.create(:seed_repository)
#
#     50.times do
#       build = FactoryGirl.create(:seed_build, :repository => repository)
#     end
#
#     repository.last_build_id = repository.last_build.id
#     repository.save
#   end
# end
