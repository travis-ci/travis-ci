channel: jobs
event: build:queued
data: {
  'build': {
    'number': 46,
    'commit': '9854592',
    'id': 857,
    'parent_id': null,
    'author_name': 'Sven Fuchs',
    'author_email': 'svenfuchs@artweb-design.de',
    'committer_name': 'Sven Fuchs',
    'committer_email': 'svenfuchs@artweb-design.de',
    'committed_at': '2011-03-10T17: 18: 27Z',
    'message': 'fix unit tests',
    'repository': {
      'name': 'travis-ci/travis-ci',
      'last_duration': null,
      'url': 'https: //github.com/travis-ci/travis-ci',
      'id': 59
    },
    'enqueued_at': '2011-03-10T18: 07: 22Z',
    'meta_id': '480c83ab1edbc36fa7c1323a31bd597710f72887',
    'config': null,
    'status': null
  }
}

channel: repositories,
event: build:started,
data: {
  'build': {
    'id': 857,
    'parent_id': null,
    'number': 46,
    'repository': {
      'name': 'travis-ci/travis-ci',
      'last_duration': null,
      'url': 'https: //github.com/travis-ci/travis-ci',
      'id': 59
    },
    'commit': '4df463d5082448b58ea7367df6c4a9b5e059c9ca',
    'committed_at': '2011-03-10T17: 18: 27Z',
    'author_name': 'Sven Fuchs',
    'author_email': 'svenfuchs@artweb-design.de',
    'committer_name': 'Sven Fuchs',
    'committer_email': 'svenfuchs@artweb-design.de',
    'message': 'fix unit tests',
    'started_at': '2011-03-10T19: 07: 24+01: 00',
    'status': null
    'config': null,
  }
}

channel: repositories
event: build:log
data: {
  'log': '$ git clean -fdx',
  'build': {
    'id': 857
    'repository': {
      'id': 59
    },
  }
}

channel: repositories
event: build: finished
data: {
  'build': {
    'committed_at': '2011-03-10T17: 18: 27Z',
    'number': 46,
    'repository': {
      'name': 'travis-ci/travis-ci',
      'last_duration': null,
      'url': 'https: //github.com/travis-ci/travis-ci',
      'id': 59
    },
    'commit': '4df463d5082448b58ea7367df6c4a9b5e059c9ca',
    'finished_at': '2011-03-10T19: 07: 47+01: 00',
    'author_name': 'Sven Fuchs',
    'committer_name': 'Sven Fuchs',
    'config': null,
    'id': 857,
    'parent_id': null,
    'author_email': 'svenfuchs@artweb-design.de',
    'committer_email': 'svenfuchs@artweb-design.de',
    'message': 'fix unit tests',
    'status': 0
  }
}
