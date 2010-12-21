var Repository = Backbone.Model.extend({
  is_building: function() {
    return !this.attributes.last_build.finished_at;
  },
});

Repository.from_build_data = function(data) {
  var attributes = data.repository;
  attributes.last_build = _.clone(data);
  delete attributes.last_build.repository;
  return new Repository(attributes);
};

var Repositories = Backbone.Collection.extend({
  url: '/repositories',
  model: Repository,
  initialize: function(app) {
    _.bindAll(this, 'update');
  },
  update: function(data) {
    var attributes = Repository.from_build_data(data).attributes;
    var repository = this.get(attributes.id);
    repository ?  repository.set(attributes) : this.add(new Repository(attributes));
  }
});

