ENV["RAILS_ENV"] = "test"
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'

class ActiveSupport::TestCase
  DatabaseCleaner.strategy = :truncation

  def setup
    DatabaseCleaner.start
  end

  def teardown
    DatabaseCleaner.clean
  end

  def flush_redis
    Resque.redis.flushall
  rescue
    skip("Cannot connect to Redis. Omitting this test.")
  end

  class BuildableMock
    def configure; end
    def run!; {} end
  end

  class ConnectionMock
    def callback; end
    def errback; end
  end
end

module BuildableTestHelper
  def config(config = nil)
    Travis::Buildable::Config.new(config_file(config).path)
  end

  def config_file(config = nil)
    Tempfile.new("travis.yml").tap do |file|
      file.write(YAML.dump(config || { :script => 'testing' }))
      file.flush
    end
  end
end

GITHUB_PAYLOADS = {
  "gem-release" => %({
    "repository": {
      "url": "http://github.com/svenfuchs/gem-release"
    },
    "commits": [{
      "id":        "9854592",
      "message":   "Bump to 0.0.15",
      "timestamp": "2010-10-27 04:32:37",
      "committer": {
        "name":  "Sven Fuchs",
        "email": "svenfuchs@artweb-design.de"
      },
      "author": {
        "name":  "Christopher Floess",
        "email": "chris@flooose.de"
      }
    }]
  })
}

RESQUE_PAYLOADS = {
  'gem-release' => {
    'repository' => {
      'id' => 1,
      'name' => 'svenfuchs/gem-release',
      'url' => 'http://github.com/svenfuchs/gem-release',
      'last_duration' => nil
    },
    'id' => 1,
    'number' => 1,
    'commit' => '9854592',
    'message' => 'Bump to 0.0.15',
    'committer_name' => 'Sven Fuchs',
    'committer_email' => 'svenfuchs@artweb-design.de',
    'author_name' => 'Christopher Floess',
    'author_email' => 'chris@flooose.de',
    'committed_at' => '2010-10-27T04:32:37Z',
    'status' => nil
  }
}

# {'build': {"committed_at":"2011-01-11T10:33:49Z", "number":13,"repository":{"name":"svenfuchs/minimal","last_duration":null,"url":"https://github.com/svenfuchs/minimal","id":7},"commit":"5329b9b8bf206344f685359c5e60eb9f10400dc9","author_name":"Sven Fuchs","committer_name":"Sven Fuchs","id":86,"author_email":"svenfuchs@artweb-design.de","committer_email":"svenfuchs@artweb-design.de","message":"Bump to 0.0.23","status":null}}
