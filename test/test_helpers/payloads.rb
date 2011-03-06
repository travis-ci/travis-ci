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
    'status' => nil,
    'config' => nil
  }
}

# TODO use these in builder/rails_test
WORKER_PAYLOADS = {
  :started    => { 'build' => { 'started_at' => 'Mon Mar 07 01:42:00 +0100 2011' } },
  :configured => { 'build' => { 'config' => { 'script' => 'rake', 'rvm' => ['1.8.7', '1.9.2'], 'gemfile' => ['gemfiles/rails-2.3.x', 'gemfiles/rails-3.0.x'] } } },
  :log        => { 'build' => { 'log' => ' ... appended' } },
  :finished   => { 'build' => { 'finished_at' => 'Mon Mar 07 01:43:00 +0100 2011', 'status' => 1, 'log' => 'final build log' } }
}
