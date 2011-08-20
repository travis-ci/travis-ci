class Build
  module Tagging
    def add_tags
      tags_to_add =[]
      # Load rules.yml file from config
      rules.each do |key, rule|
        # Try to match each rule on log or config Build attribute
        if log.to_s + config.to_s =~ /#{rule['pattern']}/
          tags_to_add << key
        end
      end
      update_attribute(:tags, tags_to_add.uniq.join(',')) unless tags_to_add.empty?
    end

    def rules
      rules = read_yml_rules
    end

    def read_yml_rules
      YAML.load_file(File.expand_path(path))
    end

    def path(environment = nil)
      filename = 'rules.yml'
      path = "./config/#{filename}"
      return path if File.exists?(path)
      raise "Could not find a configuration file. Valid paths are: #{paths.join(', ')}"
    end

  end
end
