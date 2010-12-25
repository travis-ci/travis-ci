# require 'travis/web_socket_server'
# require 'evented_redis'
#
# EventMachine.defer do
#   begin
#     sleep(0.25) until EventMachine.reactor_running?
#     puts 'starting websocket server.'
#     Travis::WebSocketServer.start # (:debug => true)
#   rescue Exception => e
#     puts e
#     e.backtrace.each { |line| puts line }
#   end
# end unless Rails.env.test?

def pusher_config
  @pusher_config ||= YAML.load_file(Rails.root.join('config/pusher.yml'))
end

Pusher.app_id = ENV['pusher_app_id'] || pusher_config['app_id']
Pusher.key    = ENV['pusher_key']    || pusher_config['key']
Pusher.secret = ENV['pusher_secret'] || pusher_config['secret']
