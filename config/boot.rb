require 'rubygems'

#
# First of all, we need to switch to Syck b/c of ruby 1.9.2, which struggles with keys merge
# please refer: https://github.com/tenderlove/psych/issues/8 and http://redmine.ruby-lang.org/issues/show/4300
# for details.
# If block is more b/c of ruby 1.8.7, since ENGINE was not introduced yet back then.
#
if YAML.const_defined?(:ENGINE)
  YAML::ENGINE.yamler = 'syck'
end

# Set up gems listed in the Gemfile.
ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../../Gemfile', __FILE__)

require 'bundler/setup' if File.exists?(ENV['BUNDLE_GEMFILE'])
