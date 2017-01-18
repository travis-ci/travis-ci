STDOUT.sync = true;

puts "Using RUBY_VERSION: #{RUBY_VERSION}"

1.upto(100) do
  sleep(0.01)
  putc '.'
  STDOUT.flush
end

exit 0
