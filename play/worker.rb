require 'session'
require 'shellwords'

cmd = <<-cmd
source ~/.rvm/scripts/rvm
rvm use 1.9.2
ruby play/worker_test.rb
cmd

cmd = cmd.strip.split("\n").map do |line|
  "echo #{Shellwords.escape("$ #{line}")}\n#{line}"
end.join("\n")

puts "-- using system('bash -c ...')"
result = system("bash -c '#{cmd}'")
puts "\n"
p result

puts "\n-- using bash.execute(...)"
bash = Session::Bash.new
bash.execute(cmd) do |out, err|
  STDOUT << out if out
  STDOUT << err if err
end

puts "\n"
p bash.exit_status
