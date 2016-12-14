#!/usr/bin/env ruby

$LOAD_PATH.unshift *Dir["#{File.dirname(__FILE__)}/../vendor/**/lib"]

require "json"

github_username = "ifesdjeen"
github_token = "your-token"
host_and_port = "localhost:3000"
curl_tmp_file = "payload_data_curl"

payload_file = File.new("payload_data")
hash = eval(payload_file.read)

payload_json = JSON.generate(hash["payload"])

File.open( curl_tmp_file, 'w' ) { |f| f.write( "payload=#{payload_json}" ) }

exec "curl --data-binary @#{curl_tmp_file} http://#{github_username}:#{github_token}@#{host_and_port}/builds"
