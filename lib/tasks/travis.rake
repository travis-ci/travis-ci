require "fileutils"

namespace :travis do
  desc "Setup travis for local development"
  task setup: ["travis:setup:db"]

  namespace :setup do
    desc "Setup database stuff"
    task db: ["db:drop", "db:setup"]

    desc "Copy sample config files"
    task :config do
      ["database", "travis"].each do |file|
        config = Rails.root.join("config", "#{file}.yml")
        FileUtils.cp(config.to_s.gsub(".yml", ".example.yml"), config)
      end
    end
  end

  namespace :jobs do
    namespace :configure do
      desc "Show how many Configure Jobs have not started in the past 6 hours ago"
      task not_started: :environment do
        count = Job::Configure.where('created_at > ?', 6.hours.ago).where('started_at IS NULL').count
        puts "Configure Jobs not started in the last 6 hours : #{count}"
      end

      desc "Requeue Configure Jobs which have not started"
      task requeue: :environment do
        jobs = Job::Configure.where('created_at > ?', 6.hours.ago).where('started_at IS NULL').to_a
        puts "Configure Jobs not started in the last 6 hours : #{jobs.size}\n\n"
        puts "Requeuing all the non-started jobs ..."
        jobs.each { |j| j.enqueue }
        puts "Done :)"
      end
    end
  end
end
