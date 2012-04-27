module Travis
  module Api
    module Json
      module Http
        module Job
          autoload :Test,  'travis/api/json/http/job/test'
          autoload :Tests, 'travis/api/json/http/job/tests'
        end
      end
    end
  end
end
