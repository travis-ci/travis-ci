require "fileutils"

namespace :travis do
  desc "Setup travis for local development"
  task :setup => ["travis:setup:db"]

  namespace :setup do
    desc "Setup database stuff"
    task :db => ["environment", "config", "db:drop", "db:create", "db:migrate", "environment", "db:seed"]

    desc "Copy sample config files"
    task "config" do
      ["database", "travis"].each do |file|
        config = Rails.root.join("config", "#{file}.yml")
        FileUtils.cp(config.to_s.gsub(".yml", ".example.yml"), config)
      end
    end
  end

  desc "Create an admin user unless a user exists. Set the first User as an admin."
  task :create_admin_user => :environment do
    u = User.first || User.create(:name => 'Admin', :login => 'admin')
    u.is_admin = true
    u.save(:validate => false)
  end
end
