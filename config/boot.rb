require 'rubygems'

# Set up gems listed in the Gemfile.
ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../../Gemfile', __FILE__)

if YAML.const_defined?("ENGINE")
  YAML::ENGINE.yamler = 'syck'
end

require 'bundler/setup' if File.exists?(ENV['BUNDLE_GEMFILE'])
