require 'travis'

if Travis.config['hoptoad']
  HoptoadNotifier.configure do |config|
    config.api_key = Travis.config['hoptoad']['key'] rescue nil
  end
end