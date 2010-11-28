# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)
require 'rake'

task :default => [:cucumber, :test]

TravisRails::Application.load_tasks

# gaaawd, rake.
Rake.application['test'].actions.clear

task :test do
  STDOUT.sync = true
  system('ruby -Itest test/all.rb')
  state = $?
  exit(state.exitstatus) if state.exited? and state.exitstatus != 0
end
