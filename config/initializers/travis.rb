require 'travis'

[:repositories, :builds, :jobs].each do |key|
  Travis.services[key] = Travis::Services.const_get(key.to_s.camelize)
end
