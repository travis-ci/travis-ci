require 'rack'

module Rack
  class Sopa
    def initialize(app)
      @app = app
      @src = ::File.read(::File.join(Rails.public_path, 'sopa.html'))
    end

    def call(env)
      request = Rack::Request.new(env)
      if (request.path_info == '/' or request.path_info.empty?) and not request.cookies['fuck_sopa'] and not request.params['fuck_sopa']
        Rack::Response.new(@src).finish
      else
        status, headers, body = @app.call(env)
        Rack::Utils.set_cookie_header! headers, 'fuck_sopa', 'yeah'
        [status, headers, body]
      end
    end
  end
end
