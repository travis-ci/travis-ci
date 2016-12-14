require 'rubygems'
require 'em-http'

EventMachine.run {
  http = EventMachine::HttpRequest.new('http://127.0.0.1:3000/builds/16').post :body => { :started_at => Time.now.utc }

  http.callback {
    p http.response_header.status
    p http.response_header
    p http.response

    EventMachine.stop
  }
}
