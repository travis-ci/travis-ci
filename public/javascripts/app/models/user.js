Travis.Models.User = Backbone.Model.extend({
  initialize: function(attributes) {
    // _.bindAll(this, 'repository', 'isBuilding', 'color', 'duration', 'eta', 'toJSON');
    this.repositories = new Repositories;
  }
});

Travis.Collections.Users = Backbone.Collection.extend({
  model: Travis.Models.User,
  initialize: function(users, options) {
    // _.bindAll(this, 'load', 'retrieve');
    // this.url = 'repositories/' + this.repository.id + '/builds';
  },
  comparator: function(user) {
    return user.get('name');
  }
});

