module Task::Tagging
  class << self
    def rules
      @@rules ||= YAML.load_file('./config/tagging.yml')
    end
  end

  def add_tags
    subject = log.to_s + config.to_s
    tags = Task::Tagging.rules.inject([]) do |result, rule|
      result << rule['tag'] if subject =~ /#{rule['pattern']}/
      result
    end
    self.tags = tags.uniq.join(',') if tags.present?
  end

  def rules
    rules = read_yml_rules
  end
end
