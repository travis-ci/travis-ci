HoptoadNotifier.configure do |config|
  config.api_key = ENV['HOPTOAD_API_KEY'] rescue nil
end
