require 'travis/web_socket_server'
require 'evented_redis'

EventMachine.defer do
  begin
    sleep(0.25) until EventMachine.reactor_running?
    puts 'starting websocket server.'
    Travis::WebSocketServer.start # (:debug => true)
  rescue Exception => e
    puts e
    e.backtrace.each { |line| puts line }
  end
end unless Rails.env.test?
