GITHUB_PAYLOADS = {
  "private-repo" => %({
    "repository": {
      "url": "http://github.com/svenfuchs/gem-release",
      "name": "gem-release",
      "private":true,
      "owner": {
        "email": "svenfuchs@artweb-design.de",
        "name": "svenfuchs"
      }
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
    }],
    "ref": "refs/heads/master"
  }),

  "gem-release" => %({
    "repository": {
      "url": "http://github.com/svenfuchs/gem-release",
      "name": "gem-release",
      "owner": {
        "email": "svenfuchs@artweb-design.de",
        "name": "svenfuchs"
      }
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
    }],
    "ref": "refs/heads/master",
    "compare": "https://github.com/svenfuchs/gem-release/compare/af674bd...9854592"
  }),

  "gem-release-fork" => %({
    "repository": {
      "url": "http://github.com/martinciu/gem-release",
      "name": "gem-release",
      "owner": {
        "email": "marcin.ciunelis@gmail.com",
        "name": "martinciu"
      },
      "parent": "svenfuchs/gem-release",
      "fork": "true"
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
    }],
    "ref": "refs/heads/master",
    "compare": "https://github.com/svenfuchs/gem-release/compare/af674bd...9854592"
  }),

  "gem-release-fork-unique" => %({
    "repository": {
      "url": "http://github.com/martinciu/gem-release",
      "name": "gem-release",
      "owner": {
        "email": "marcin.ciunelis@gmail.com",
        "name": "martinciu"
      },
      "parent": "svenfuchs/gem-release",
      "fork": "true"
    },
    "commits": [{
      "id":        "9854593",
      "message":   "Some bugs added",
      "timestamp": "2011-10-27 04:32:37",
      "committer": {
        "name":  "Marcin Ciunelis",
        "email": "marcin.ciunelis@gmail.com"
      },
      "author": {
        "name":  "Marcin Ciunelis",
        "email": "marcin.ciunelis@gmail.com"
      }
    }],
    "ref": "refs/heads/master",
    "compare": "https://github.com/svenfuchs/gem-release/compare/9854592...9854593"
  }),

  "gh-pages-update" => %({
    "repository": {
      "url": "http://github.com/svenfuchs/gem-release",
      "name": "gem-release",
      "owner": {
        "email": "svenfuchs@artweb-design.de",
        "name": "svenfuchs"
      }
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
    }],
    "ref": "refs/heads/gh-pages"
  }),

  "gh_pages-update" => %({
    "repository": {
      "url": "http://github.com/svenfuchs/gem-release",
      "name": "gem-release",
      "owner": {
        "email": "svenfuchs@artweb-design.de",
        "name": "svenfuchs"
      }
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
    }],
    "ref": "refs/heads/gh_pages"
  }),

  # it is unclear why this payload was send but it happened quite often. the force option
  # seems to indicate something like $ git push --force
  "force-no-commit" => %({
    "pusher": { "name": "LTe", "email":"lite.88@gmail.com" },
    "repository":{
      "name":"acts-as-messageable",
      "created_at":"2010/08/02 07:41:30 -0700",
      "has_wiki":true,
      "size":200,
      "private":false,
      "watchers":13,
      "fork":false,
      "url":"https://github.com/LTe/acts-as-messageable",
      "language":"Ruby",
      "pushed_at":"2011/05/31 04:16:01 -0700",
      "open_issues":0,
      "has_downloads":true,
      "homepage":"http://github.com/LTe/acts-as-messageable",
      "has_issues":true,
      "forks":5,
      "description":"ActsAsMessageable",
      "owner": { "name":"LTe", "email":"lite.88@gmail.com" }
    },
    "ref_name":"v0.3.0",
    "forced":true,
    "after":"b842078c2f0084bb36cea76da3dad09129b3c26b",
    "deleted":false,
    "ref":"refs/tags/v0.3.0",
    "commits":[],
    "base_ref":"refs/heads/master",
    "before":"0000000000000000000000000000000000000000",
    "compare":"https://github.com/LTe/acts-as-messageable/compare/v0.3.0",
    "created":true
  }),

  :oauth => {
    "uid" => "234423",
    "user_info" => {
      "name" => "John",
      "nickname" => "john",
      "email" => "john@email.com"
    },
    "credentials" => {
      "token" => "1234567890abcdefg"
    }
  },

  :oauth_updated => {
    "uid" => "234423",
    "user_info" => {
      "name" => "Johnathan",
      "nickname" => "johnathan",
      "email" => "johnathan@email.com"
    },
    "credentials" => {
      "token" => "1234567890abcdefg"
    }
  }
}


# RESQUE_PAYLOADS = {
#   "gem-release" => {
#     "repository" => {
#       "id" => 1,
#       "slug" => "svenfuchs/gem-release",
#     },
#     "build" => {
#       "id" => 1,
#       "commit" => "9854592",
#     }
#   }
# }

WORKER_PAYLOADS = {
  # :started    => { "build" => { "started_at" => "2011-06-16 22:59:41 +0200" } },
  # :configured => { "build" => { "config" => { "script" => "rake", "rvm" => ["1.8.7", "1.9.2"], "gemfile" => ["gemfiles/rails-2.3.x", "gemfiles/rails-3.0.x"] } } },
  # :log        => { "build" => { "log" => " ... appended" } },
  # :finished   => { "build" => { "finished_at" => "2011-06-16 22:59:41 +0200", "status" => 1, "log" => "final build log" } },

  'task:configure:started'  => { 'build' => { 'started_at'  => '2011-01-01 00:00:00 +0200' } },
  'task:configure:finished' => { 'build' => { 'finished_at' => '2011-01-01 00:01:00 +0200', 'config' => { 'rvm' => ['1.8.7', '1.9.2'] } } },
  'task:test:started'       => { 'build' => { 'started_at'  => '2011-01-01 00:02:00 +0200' } },
  'task:test:log:1'         => { 'build' => { 'log'  => 'the '  } },
  'task:test:log:2'         => { 'build' => { 'log'  => 'full ' } },
  'task:test:log:3'         => { 'build' => { 'log'  => 'log'   } },
  'task:test:finished'      => { 'build' => { 'finished_at' => '2011-01-01 00:03:00 +0200', 'status' => 0, 'log' => 'the full log' } }
}

QUEUE_PAYLOADS = {
  'task:configure' => {
    :build      => { :id => 1, :commit => '9854592', :branch => 'master' },
    :repository => { :id => 1, :slug => 'svenfuchs/gem-release' },
    :queue      => 'builds'
  },
  'task:test:1' => {
    :build      => { :id => 2, :number => '1.1', :commit => '9854592', :branch => 'master', :config => { :rvm => '1.8.7' } },
    :repository => { :id => 1, :slug => 'svenfuchs/gem-release' },
    :queue      => 'builds'
  },
  'task:test:2' => {
    :build      => { :id => 3, :number => '1.2', :commit => '9854592', :branch => 'master', :config => { :rvm => '1.9.2' } },
    :repository => { :id => 1, :slug => 'svenfuchs/gem-release' },
    :queue      => 'builds'
  }
}
