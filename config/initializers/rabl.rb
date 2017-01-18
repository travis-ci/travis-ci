Rabl.configure do |config|
  config.include_json_root = false
  config.include_xml_root  = false
  config.xml_options = { :dasherize => false, :skip_types => true }
end
