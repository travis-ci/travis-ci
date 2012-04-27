module Responders
  autoload :Json,        'responders/json'
  autoload :StatusImage, 'responders/status_image'
  autoload :Xml,         'responders/xml'

  require 'responders/controller_method'
end
