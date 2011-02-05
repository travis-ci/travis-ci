var User = Backbone.Model.extend({
  initialize: function(attributes) {
    // _.bindAll(this, 'repository', 'is_building', 'color', 'duration', 'eta', 'toJSON');
    this.repositories = new Repositories;
  }
});

var Users = Backbone.Collection.extend({
  model: User,
  initialize: function(users, options) {
    // _.bindAll(this, 'load', 'retrieve');
    // this.url = 'repositories/' + this.repository.id + '/builds';
  },
  comparator: function(user) {
    return user.get('name');
  }
});

