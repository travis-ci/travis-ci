require 'rubygems'

# Set up gems listed in the Gemfile.
ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../../Gemfile', __FILE__)

require 'bundler/setup' if File.exists?(ENV['BUNDLE_GEMFILE'])

# TODO fix locale files to work with Psych
require 'yaml'
if YAML.const_defined?("ENGINE")
  YAML::ENGINE.yamler = 'syck'
end

