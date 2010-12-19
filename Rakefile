# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

# $stdout.sync = true
# $: << File.expand_path('../lib', __FILE__)
#
# require 'rake'
# require 'resque/tasks'
# require 'travis'

$stdout.sync = true
require File.expand_path('../config/application', __FILE__)
# $: << File.expand_path('../lib', __FILE__)

require 'rake'
require 'resque/tasks'
require 'travis'

# task :default => [:cucumber, :test]
TravisRails::Application.load_tasks

# # gaaawd, rake.
# Rake.application['test'].actions.clear

# task :test do
#   STDOUT.sync = true
#   system('ruby -Itest test/all.rb')
#   state = $?
#   exit(state.exitstatus) if state.exited? and state.exitstatus != 0
# end
