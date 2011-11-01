require 'active_support/concern'

class Job
  module Tagging
    class << self
      def rules
        @@rules ||= YAML.load_file('./config/tagging.yml')
      end
    end

    def add_tags
      subject = log.to_s + config.to_s
      tags = Tagging.rules.inject([]) do |result, rule|
        result << rule['tag'] if subject =~ /#{rule['pattern']}/
        result
      end
      self.tags = tags.uniq.join(',')
    end
  end
end
