#!/usr/bin/env ruby

# https://gist.github.com/raw/909740/102dc1f17d605f299d6d91d5462f73a56a10c7e3/ruby_rvm_system_invocation.rb

# How to run a system command from ruby within a clean bash that has never sourced rvm using a custom ruby version

# 1) install rvm as the correct user
# 2) do NOT follow the instructions about sourcing and adding this to your .bashrc
# 3) run the following (change the versions accordingly)

ruby_versions = %w(ruby-1.8.7-p302 ruby-1.9.2-p0)

ruby_versions.each do |version|
  puts ('>' * 20) + " #{version}"
  %w(true false).each do |bool|
    puts %Q~the following should output "#{bool}"~
    p system(%(bash -c 'FOO=#{version}; source "/Volumes/Users/sven/.rvm/scripts/rvm"; rvm use #{version}; ruby -v; echo "echo $FOO"; #{bool}'))
    puts ('=' * 20)
  end
  puts ('<' * 20)
end

