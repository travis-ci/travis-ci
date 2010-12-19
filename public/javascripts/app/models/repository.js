var Repository = Backbone.Model.extend({
});

var Repositories = Backbone.Collection.extend({
  url: '/repositories',
  model: Repository,
  initialize: function(app) {
    _.bindAll(this, 'update_build');
  },
  update_build: function(data) {
    var attributes = this.invert_build_data(data);
    var repository = this.get(attributes.id);
    if(repository) { repository.set(attributes); }
  },
  invert_build_data: function(data) {
    var attributes = data.repository;
    attributes.last_build = _.clone(data);
    delete attributes.last_build.repository;
    return attributes;
  }
});

