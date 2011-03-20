require 'rubygems'
require 'eventmachine'
require 'travis'

EM.run do
  Travis::Synchronizer.timeout = 0.2

  Travis::Synchronizer.receive(1, 2) { p 2 }
  Travis::Synchronizer.receive(1, 1) { p 1 }
  Travis::Synchronizer.receive(1, 4) { p 4 }

  EM.add_timer(0.3) { EM.stop }
end

