var User = Backbone.Model.extend({
  initialize: function(attributes) {
    // _.bindAll(this, 'repository', 'is_building', 'color', 'duration', 'eta', 'toJSON');
    this.repositories = Repositories.new();
  }
});

var Users = Backbone.Collection.extend({
  model: User,
  initialize: function(builds, options) {
    // _.bindAll(this, 'load', 'retrieve');
    // this.url = 'repositories/' + this.repository.id + '/builds';
  },
  comparator: function(build) {
    return build.get('name');
  }
});

