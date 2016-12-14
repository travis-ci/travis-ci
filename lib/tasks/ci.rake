namespace :test do
  desc 'a little shortcut for ci testing'
  task :ci => ['ci_env', 'db:drop', 'db:create', 'db:test:load', 'spec', 'jasmine_on_travis']
  task :jasmine => ['jasmine_on_travis']
end

task :ci_env do
  ENV['CI'] = 'true'
  ENV['RAILS_ENV'] = 'test'
end

task :jasmine_on_travis => ['ci_env', 'assets:clean', 'assets:precompile'] do
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
  puts "Starting to run jasmine:ci..."
  system("export DISPLAY=:99.0 && bundle exec rake jasmine:ci")
  stat = $?.exitstatus
  system("bundle exec rake assets:clean")
  exit(stat)
end