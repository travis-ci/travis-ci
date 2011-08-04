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
  'force-no-commit' => %({
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

  'travis-ci' => %({
    "created": false,
    "commits": [
      { "modified": ["public/javascripts/app/controllers/application.js"],
        "removed": [],
        "message": "Adding debug log messages to application.js",
        "distinct": false,
        "added": [],
        "url": "https://github.com/travis-ci/travis-ci/commit/d2ee302726c96966085c605a22db8f4ec88cfeea",
        "timestamp": "2011-08-04T09:33:11-07:00",
        "id": "d2ee302726c96966085c605a22db8f4ec88cfeea",
        "author": {
          "email": "oleksandr.petrov@gmail.com",
          "username": "ifesdjeen",
          "name": "Oleksandr Petrov"
        }
      }
    ],
    "before": "d76c31606fe88118559f55600edffcc484cd6573",
    "forced": false,
    "after": "d2ee302726c96966085c605a22db8f4ec88cfeea",
    "deleted": false,
    "repository": {
      "has_wiki": true,
      "watchers": 535,
      "has_issues": true,
      "open_issues": 60,
      "forks": 84,
      "organization": "travis-ci",
      "created_at": "2011/02/27 22:30:40 -0800",
      "fork": false,
      "url": "https://github.com/travis-ci/travis-ci",
      "pushed_at": "2011/08/04 10:25:48 -0700",
      "language": "JavaScript",
      "has_downloads": true,
      "private": false,
      "size": 812,
      "owner": {
        "email": "contact@travis-ci.org\",
        "name": "travis-ci\"
      },
      "name": "travis-ci",
      "homepage": "http://travis-ci.org",
      "description": "A distributed build system for the Ruby community. See also github.com/travis-ci/travis-worker and github.com/travis-ci/travis-cookbooks"
    },
    "compare": "https://github.com/travis-ci/travis-ci/compare/d76c316...d2ee302",
    "base_ref": "refs/heads/production",
    "ref": "refs/heads/master",
    "pusher": {
      "email": "josh.kalderimis@gmail.com",
      "name": "joshk"
    }
  })
}

RESQUE_PAYLOADS = {
  'gem-release' => {
    'repository' => {
      'id' => 1,
      'slug' => 'svenfuchs/gem-release',
    },
    'build' => {
      'id' => 1,
      'commit' => '9854592',
    }
  }
}

# TODO use these in builder/rails_test
WORKER_PAYLOADS = {
  :started    => { 'build' => { 'started_at' => '2011-06-16 22:59:41 +0200' } },
  :configured => { 'build' => { 'config' => { 'script' => 'rake', 'rvm' => ['1.8.7', '1.9.2'], 'gemfile' => ['gemfiles/rails-2.3.x', 'gemfiles/rails-3.0.x'] } } },
  :log        => { 'build' => { 'log' => ' ... appended' } },
  :finished   => { 'build' => { 'finished_at' => '2011-06-16 22:59:41 +0200', 'status' => 1, 'log' => 'final build log' } }
}
