var build_data = function(repository) {
  return { id: repository.last_build.id, number: 2, repository: { id: repository.id } };
}

var build_started_data = function(repository, data) {
  return _.extend(_.extend(build_data(repository), { id: 1, started_at: '2010-11-13T12:00:20Z' }), data || {});
}

var build_log_data = function(repository, data) {
  return _.extend(build_data(repository), data);
}

var build_finished_data = function(repository, data) {
  return _.extend(_.extend(build_data(repository), { status: 1, started_at: '2010-11-13T12:00:20Z', finished_at: '2010-11-13T14:00:20Z' }), data || {});
}

var new_repository_data = function() {
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
      last_duration: 10,
    }
  };
}
