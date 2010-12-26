var Repository = Backbone.Model.extend({
  initialize: function(attributes) {
    this.build = new Build(this.attributes.last_build);
    this.build.repository = this;
    Backbone.Model.prototype.initialize.apply(this, arguments);
    this.update_eta();
  },
  set: function(attributes) {
    this.build = new Build(attributes.last_build);
    this.build.repository = this;
    this.update_eta();
    Backbone.Model.prototype.set.apply(this, arguments);
  },
  is_building: function() {
    return !this.build.get('finished_at');
  },
  update_eta: function() {
    if(this.build.get('finished_at')) {
      this.build.unset('eta');
    } else if(this.get('last_duration')) {
      var timestamp = new Date(this.build.get('started_at')).getTime();
      var eta = new Date(timestamp + this.get('last_duration') * 1000);
      this.build.set({ eta: eta.toISOString() });
    }
  },
  toJSON: function() {
    return _.extend(Backbone.Model.prototype.toJSON.apply(this), {
      build: this.build.toJSON()
    });
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
    _.bindAll(this, 'find', 'last', 'update');
  },
  find: function(id) {
    return this.detect(function(item) { return item.id == id }, this);
  },
  last: function() {
    return this[this.length - 1];
  },
  update: function(data) {
    var attributes = Repository.from_build_data(data).attributes;
    var repository = this.get(attributes.id);
    repository ? repository.set(attributes) : this.add(new Repository(attributes));
  }
});

