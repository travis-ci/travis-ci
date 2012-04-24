module Travis
  module Api
    module Json
      module Http
        autoload :Build,        'travis/api/json/http/build'
        autoload :Builds,       'travis/api/json/http/builds'
        autoload :Commit,       'travis/api/json/http/commit'
        autoload :Job,          'travis/api/json/http/job'
        autoload :Jobs,         'travis/api/json/http/jobs'
        autoload :Repositories, 'travis/api/json/http/repositories'
        autoload :Repository,   'travis/api/json/http/repository'
        autoload :Workers,      'travis/api/json/http/workers'
      end
    end
  end
end
