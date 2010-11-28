require 'rubygems'
require 'nanite'

mapper_config = {
  :host => 'localhost',
  :user => 'mapper',
  :pass => 'testing',
  :vhost => '/nanite',
  :log_level => 'info'
}

EM.run do
  Nanite.start_mapper(mapper_config)
  EM.add_timer(2) do
    command = '/builder/build'
    payload = {
      :uri => 'path://~/Development/projects/simple_slugs',
      :build_script => 'rake'
    }
    handler = lambda { |key, from, msg, job|
      puts "#{from}: #{msg.is_a?(String) ? msg : msg.inspect}"
    }

    puts "sending request: #{command}, #{payload.inspect}"

    Nanite.request(command, payload, :intermediate_handler => handler) do |result|
      puts "got result: #{result.inspect}"
      EM.stop_event_loop
    end
  end
end

