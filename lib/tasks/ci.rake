namespace :test do
  desc 'a little shortcut for ci testing'
  task :ci => ['ci_env', 'db:drop', 'db:create', 'db:test:load', 'spec_fast', 'spec']

  RSpec::Core::RakeTask.new(:spec_fast) do |t|
    t.rspec_opts = '-Ispec_fast'
    t.pattern = "./spec_fast/**/*_spec.rb"
  end
end

task :ci_env do
  ENV['CI'] = 'true'
  ENV['RAILS_ENV'] = 'test'
end
