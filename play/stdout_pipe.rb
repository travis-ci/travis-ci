require 'rubygems'
require 'eventmachine'

$stdout.sync = true

EM.run do
  read, write = IO.pipe
  stdout = STDOUT.dup
  STDOUT.reopen(write)

  send = lambda do
    if read.eof?
      EM.stop
    else
      # instead publish this to the build_id channel in redis
      stdout << read.readpartial(1024) unless read.eof?
      EM.next_tick(&send)
    end
  end
  EM.next_tick(&send)

  EM.defer do
    10.times do
      print '.'
      sleep(0.1)
    end
    system 'echo "--"'
    write.close
    STDOUT.reopen(stdout)
  end
end
