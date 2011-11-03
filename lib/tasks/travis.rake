namespace :travis do
  desc 'Consume AMQP messages from the worker'
  task :consume_messages do
    require 'eventmachine'
    require 'travis'

    EventMachine.run do
      Travis::Consumer.start
    end
  end

  desc "Create an admin user unless a user exists. Set the first User as an admin."
  task :create_admin_user => :environment do
    u = User.first || User.create(:name => 'Admin', :login => 'admin')
    u.is_admin = true
    u.save(false)
  end
end
