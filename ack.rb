#!/usr/bin/env ruby
# Usage:
#
#    ./ack.rb your-query

require 'rubygems'
require 'bundler'

if query = ARGV[0]
  gem_dirs = Bundler.load.specs.map(&:full_gem_path).join(' ')

  ack_installed = system("which ack > /dev/null 2>&1")

  if ack_installed
    cmd  = %{ack -i "#{query}" #{gem_dirs}}
    exec cmd
  # elsif grep_installed
    # TODO add grep support
  else
    puts %{Please install ack

    E.g. brew install ack}
  end
else
  puts "No query given"
end