var build_data = function(repository) {
  return { id: repository.last_build.id, number: 2, repository: { id: repository.id } };
}

var build_created_data = function(repository, data) {
  return _.extend(_.extend(build_data(repository), { created_at: '2010-11-11T12:00:20Z' }), data || {});
}

var build_updated_data = function(repository, data) {
  return _.extend(build_data(repository), data);
}

var build_finished_data = function(repository, data) {
  return _.extend(_.extend(build_data(repository), { finished_at: '2010-11-11T14:00:20Z' }), data || {});
}

