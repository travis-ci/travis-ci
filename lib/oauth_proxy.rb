require 'rack'

class OauthProxy
  attr_accessor :app, :prefix, :target

  def initialize(app, prefix, target)
    @app, @prefix, @target = app, prefix, target
  end

  def call(env)
    return app.call(env) unless env['PATH_INFO'].start_with? prefix
    location = File.join(target, env['PATH_INFO'].sub(prefix, '')) + "?#{env["QUERY_STRING"]}"
    [302, { 'Content-Type' => 'text/plain', 'Location' => location }, []]
  end
end
