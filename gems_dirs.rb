require 'rubygems'
require 'bundler'

print Bundler.load.specs.map(&:full_gem_path).join(' ')