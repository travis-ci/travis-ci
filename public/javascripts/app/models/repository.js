var Repository = Backbone.Model.extend({
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
    _.bindAll(this, 'update_build');
  },
  update_build: function(data) {
    var attributes = Repository.from_build_data(data).attributes;
    var repository = this.get(attributes.id);
    if(repository) { repository.set(attributes); }
  },
});

