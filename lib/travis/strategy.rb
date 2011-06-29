module Travis
  module Strategy

    autoload :Base, 'travis/strategies/base'

    autoload :Github, 'travis/strategies/github'
    autoload :Local,  'travis/strategies/local'
    
    class << self 
      def create_from_payload(payload, source)
        const_get(source.to_s.camelize).create_from_payload(payload)
      end
    end

  end
end
