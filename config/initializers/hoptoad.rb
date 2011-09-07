require 'travis'

if Travis.config.hoptoad?
  HoptoadNotifier.configure do |config|
    hoptoad = Travis.config.hoptoad

    config.api_key = hoptoad.key
    config.host = hoptoad.host if hoptoad.host
    if config.port
      config.port = hoptoad.port
      config.secure = config.port == 443
    end
  end
end

