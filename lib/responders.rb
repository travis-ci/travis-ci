module Responders
  autoload :Json,        'responders/json'
  autoload :ResultImage, 'responders/result_image'
  autoload :Xml,         'responders/xml'

  require 'responders/controller_method'
end
