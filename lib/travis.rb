module Travis
  autoload :Buildable, 'travis/buildable'
  autoload :Builder,   'travis/builder'

  class << self
    def config
      @config ||= YAML.load_file(File.expand_path('../../config/travis.yml', __FILE__))
    end
  end
end
