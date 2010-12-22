var Repository = Backbone.Model.extend({
  initialize: function() {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    this.update_eta();
  },
  is_building: function() {
    return !this.attributes.last_build.finished_at;
  },
  update_eta: function() {
    if(this.attributes.last_build.finished_at) {
      this.attributes.last_build.eta = null;
    } else if(this.attributes.last_duration) {
      var timestamp = new Date(this.attributes.last_build.started_at).getTime();
      var eta = new Date(timestamp + this.attributes.last_duration * 1000);
      this.attributes.last_build.eta = eta.toISOString();
    }
  }
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
    if(repository) {
      repository.set(attributes);
    } else {
      repository = new Repository(attributes);
      this.add(repository);
    }
    repository.update_eta();
  }
});

