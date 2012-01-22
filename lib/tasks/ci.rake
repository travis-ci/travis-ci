namespace :test do
  desc 'a little shortcut for ci testing'
  task :ci => ['ci_env', 'db:drop', 'db:create', 'db:test:load', 'spec']
end

task :ci_env do
  ENV['CI'] = 'true'
  ENV['RAILS_ENV'] = 'test'
end
