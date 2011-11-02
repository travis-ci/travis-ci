# http://michaelvanrooijen.com/articles/2011/06/01-more-concurrency-on-a-single-heroku-dyno-with-the-new-celadon-cedar-stack/

worker_processes 3 # amount of unicorn workers to spin up
timeout 15         # restarts workers that hang for 15 seconds

preload_app true

before_fork do |server, worker|
  defined?(ActiveRecord::Base) and
      ActiveRecord::Base.connection.disconnect!
end

after_fork do |server, worker|
  defined?(ActiveRecord::Base) and
      ActiveRecord::Base.establish_connection

  require 'travis'
  Travis::Amqp.setup_connection
end
