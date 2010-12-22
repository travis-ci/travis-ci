var build_data = function(repository) {
  return { id: repository.last_build.id, number: 2, repository: { id: repository.id } };
}

var build_created_data = function(repository, data) {
  return _.extend(_.extend(build_data(repository), { created_at: '2010-11-11T12:00:20Z' }), data || {});
}

var build_log_data = function(repository, data) {
  return _.extend(build_data(repository), data);
}

var build_finished_data = function(repository, data) {
  return _.extend(_.extend(build_data(repository), { color: 'green', created_at: '2010-11-11T12:00:20Z', finished_at: '2010-11-11T14:00:20Z' }), data || {});
}

var new_repository_data = function() {
  return {
    id: 2,
    number: 2,
    color: 'green',
    commit: 'add057e',
    message: 'Bump to 0.0.15',
    log: '',
    duration: 10,
    started_at: '2010-10-27T04:32:37Z',
    finished_at: null,
    repository:  {
      id: 1,
      name: 'svenfuchs/gem-release',
      url: 'http://github.com/svenfuchs/gem-release',
      last_duration: 10,
    }
  };
}
