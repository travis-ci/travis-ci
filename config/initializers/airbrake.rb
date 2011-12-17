require 'travis'

if Travis.config.airbrake?
  Airbrake.configure do |config|
    airbrake = Travis.config.airbrake

    config.api_key = airbrake.key
    config.host = airbrake.host if airbrake.host

    if config.port
      config.port = airbrake.port
      config.secure = config.port == 443
    end
  end
end

