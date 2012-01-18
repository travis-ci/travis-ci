require 'rack'

module Rack
  class Sopa
    def initialize(app)
      @app = app
      @src = ::File.read(::File.join(Rails.public_path, 'sopa.html'))
    end

    def call(env)
      status, headers, body = @app.call(env)
      if headers['Content-Type'] =~ %r{text/html}
        request = Rack::Request.new(env)
        return Rack::Response.new(@src).finish unless request.cookies['fuck_sopa'] or request.params['fuck_sopa']
        Rack::Utils.set_cookie_header! headers, 'fuck_sopa', 'yeah'
      end
      [status, headers, body]
    end
  end
end
