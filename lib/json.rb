module Travis
  module Json
    autoload :Build,        'travis/api/json/build'
    autoload :Builds,       'travis/api/json/builds'
    autoload :Commit,       'travis/api/json/commit'
    autoload :Job,          'travis/api/json/job'
    autoload :Repository,   'travis/api/json/repository'
    autoload :Repositories, 'travis/api/json/repositories'
    autoload :Workers,      'travis/api/json/workers'
  end
end

