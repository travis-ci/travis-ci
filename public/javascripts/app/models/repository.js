var Repository = Backbone.Model.extend({
  initialize: function(attributes) {
    this.builds = new Builds([new Build(attributes.last_build)], { repository: this });
    Backbone.Model.prototype.initialize.apply(this, arguments); // TODO required?
    delete this.attributes.last_build;
  },
  set: function(attributes) {
    attributes = _.clone(attributes);
    var last_build = attributes.last_build;
    delete attributes.last_build;
    if(this.builds) {
      this.builds.set(last_build);
    }
    Backbone.Model.prototype.set.apply(this, [attributes]);
  },
  is_building: function() {
    var build = this.builds.last();
    return build ? !build.get('finished_at') : false;
  },
  toJSON: function(options) {
    var data = Backbone.Model.prototype.toJSON.apply(this)
    if(options == undefined) options = { include_build: true }
    return options.include_build ? _.extend(data, { build: this.builds.last().toJSON() }) : data;
  }
});

var Repositories = Backbone.Collection.extend({
  url: '/repositories',
  model: Repository,
  initialize: function(models) {
    _.bindAll(this, 'find', 'last', 'update');
  },
  find: function(id) {
    return this.detect(function(item) { return item.id == id }, this);
  },
  last: function() {
    return this.models[this.models.length - 1];
  },
  update: function(data) {
    var attributes = data.repository;
    attributes.last_build = _.clone(data);
    delete attributes.last_build.repository;
    var repository = this.get(attributes.id);
    repository ? repository.set(attributes) : this.add(new Repository(attributes));
    this.sort();
  },
  comparator: function(repository) {
    return repository.builds.last().get('started_at');
  }
});

