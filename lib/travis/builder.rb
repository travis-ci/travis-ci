require 'resque/plugins/log'

module Travis
  class Builder
    extend Resque::Plugins::Log

    @queue = :builds

    def self.perform(meta_id, payload)
      payload['script'] ||= 'bundle install; rake'
      buildable = Travis::Buildable.new(payload['uri'], payload)
      result = buildable.build
      result ? 0 : 1
    end
  end
end
