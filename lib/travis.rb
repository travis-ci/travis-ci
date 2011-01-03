module Travis
  autoload :Buildable, 'travis/buildable'
  autoload :Builder,   'travis/builder'

  class << self
    def config
      @config ||= YAML.load_file(config_file)
    end

    def config_file
      paths = [nil]
      paths.unshift(Rails.env) if defined?(Rails)
      files = paths.map { |env| File.expand_path(['../../config/travis', env, 'yml'].compact.join('.'), __FILE__) }
      files.detect { |file| File.exist?(file) }
    end
  end
end
