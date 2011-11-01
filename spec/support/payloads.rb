GITHUB_PAYLOADS = {
  "travis-ci" => {
    "pusher" => {
      "name" => "svenfuchs",
      "email" => "svenfuchs@artweb-design.de"
    },
    "created" => false,
    "compare" => "https://github.com/travis-ci/travis-ci/compare/5878605...04beda1",
    "ref" => "refs/heads/statemachine",
    "forced" => false,
    "commits" => [
      {
        "modified" => [
          "lib/travis/renderer.rb",
          "spec/support/json_helpers.rb",
          "test/unit/json_test.rb"
        ],
        "author" => {
          "username"=> "svenfuchs",
          "name" => "Sven Fuchs",
          "email" => "svenfuchs@artweb-design.de"
        },
        "message" => "port json_test to specs and port as_json chaos to rabl templates and Travis::Renderer. tons of templates and duplication but at least it's easier to understand now",
        "removed" => [
          "app/views/v1/http/repositories/index.rabl",
          "app/views/v1/http/repositories.rabl",
          "app/views/v1/http/tasks/configure.rabl",
          "app/views/v1/http/builds/show.rabl",
          "app/views/v1/http/repositories/show.rabl",
          "app/views/v1/http/tasks/test.rabl",
          "spec/json/builds_spec.rb",
          "spec/models/build/json_spec.rb",
          "spec/models/repository/json_spec.rb",
          "spec/models/task/json_spec.rb"
        ],
        "url" => "https://github.com/travis-ci/travis-ci/commit/46940034d57092134f9807de6d09f2d48fec271a",
        "timestamp" => "2011-08-06T17:02:28-07:00",
        "distinct" => true,
        "added" => [
          "app/views/v1/default/build.rabl",
          "app/views/v1/default/commit.rabl",
          "app/views/v1/default/repositories.rabl",
          "app/views/v1/default/repository.rabl",
          "app/views/v1/default/task/configure.rabl",
          "app/views/v1/default/task/test.rabl",
          "app/views/v1/event/build_finished/build.rabl",
          "app/views/v1/event/build_finished/repository.rabl",
          "app/views/v1/event/build_log/build.rabl",
          "app/views/v1/event/build_log/repository.rabl",
          "app/views/v1/event/build_log/task/test.rabl",
          "app/views/v1/event/build_queued/build.rabl",
          "app/views/v1/event/build_queued/repository.rabl",
          "app/views/v1/event/build_started/build.rabl",
          "app/views/v1/event/build_started/repository.rabl",
          "app/views/v1/event/build_started/task/test.rabl",
          "app/views/v1/job/commit.rabl",
          "app/views/v1/job/repository.rabl",
          "app/views/v1/job/task/test.rabl",
          "app/views/v1/webhook/build.rabl",
          "app/views/v1/webhook/repository.rabl",
          "spec/json/build_spec.rb",
          "spec/json/repository_spec.rb",
          "spec/json/task_spec.rb"
        ],
        "id" => "46940034d57092134f9807de6d09f2d48fec271a"
      },
      {
        "modified" => [
          "app/controllers/builds_controller.rb",
          "app/models/request.rb",
          "app/models/task.rb",
          "lib/travis/worker.rb",
          "spec/lib/travis/notifications/irc_spec.rb",
          "spec/spec_helper.rb",
          "spec/support/github_api.rb",
          "spec/support/mocks.rb"
        ],
        "author" => {
          "username" => "svenfuchs",
          "name" => "Sven Fuchs",
          "email" => "svenfuchs@artweb-design.de"
        },
        "message" => "Merge branch 'statemachine' of github.com:travis-ci/travis-ci into statemachine",
        "removed" => [],
        "url" => "https://github.com/travis-ci/travis-ci/commit/04beda102abcb37b353e406663535d2bc2c4da5c",
        "timestamp" => "2011-08-06T17:03:40-07:00",
        "distinct" => true,
        "added" => [
          "spec/controllers/builds_controller_spec.rb",
          "spec/support/redis_helper.rb"
        ],
        "id" => "04beda102abcb37b353e406663535d2bc2c4da5c"
      }
    ],
    "before" => "5878605c3c4c099f33b725f63f09fc8a37b08741",
    "after" => "04beda102abcb37b353e406663535d2bc2c4da5c",
    "deleted" => false,
    "base_ref" => nil,
    "repository" => {
      "homepage" => "http://travis-ci.org",
      "open_issues" => 61,
      "forks" => 87,
      "organization" => "travis-ci",
      "pushed_at" => "2011/08/06 17:03:56 -0700",
      "has_wiki" => true,
      "fork" => false,
      "watchers" => 543,
      "url" => "https://github.com/travis-ci/travis-ci",
      "has_issues" => true,
      "has_downloads" => true,
      "private" => false,
      "size" => 828,
      "created_at" => "2011/02/27 22:30:40 -0800",
      "owner" => {
        "name" => "travis-ci",
        "email" => "contact@travis-ci.org"
      },
      "name" => "travis-ci",
      "language" => "JavaScript",
      "description" => "A distributed build system for the Ruby community. See also github.com/travis-ci/travis-worker and github.com/travis-ci/travis-cookbooks"
    }
  },

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
