module Travis
  autoload :Buildable, 'travis/buildable'
  autoload :Builder,   'travis/builder'

  class << self
    def config
      @config ||= YAML.load_file(config_file)
    end

    def config_file
      files = [Rails.env, nil].map { |env| File.expand_path(['../../config/travis', env, 'yml'].compact.join('.'), __FILE__) }
      files.detect { |file| File.exist?(file) }
    end
  end
end
