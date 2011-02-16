var buildData = function(repository) {
  return { id: repository.last_build.id, number: 2, repository: { id: repository.id } };
}

var buildStartedData = function(repository, data) {
  return _.extend(_.extend(buildData(repository), { id: 1, started_at: '2010-11-13T12:00:20Z' }), data || {});
}

var buildLogData = function(repository, data) {
  return _.extend(buildData(repository), data || {});
}

var buildFinishedData = function(repository, data) {
  return _.extend(_.extend(buildData(repository), { status: 1, started_at: '2010-11-13T12:00:20Z', finished_at: '2010-11-13T14:00:20Z' }), data || {});
}

var buildQueuedData = function(repository, data) {
  return _.extend({
    'number': 1,
    'enqueued_at': '2011-01-12T15: 32: 54.706695Z',
    'commit': '565294c',
    'repository': {
      'name': 'josevalim/enginex',
      'url': 'https: //github.com/josevalim/enginex',
      'id': 524108036
    },
    'meta_id': '4085042bf6ef34d92420036ce2793b7361cd0bd4',
    'id': 143915106
  }, data || {});
}

var newRepositoryData = function() {
  return {
    id: 2,
    number: 2,
    status: 1,
    commit: 'add057e',
    message: 'Bump to 0.0.15',
    log: '',
    started_at: '2010-11-13T12:00:00Z',
    finished_at: null,
    repository:  {
      id: 1,
      name: 'svenfuchs/gem-release',
      url: 'http://github.com/svenfuchs/gem-release',
      lastDuration: 10,
    }
  };
}
