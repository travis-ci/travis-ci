require 'rubygems'
require 'bundler/setup'
require 'test/unit'
require 'test_declarative'
require 'ruby-debug'
require 'mocha'

require 'travis'

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
