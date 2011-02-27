Travis.Models.Repository = Backbone.Model.extend({
  initialize: function(attributes) {
    _.bindAll(this, 'buildAdded', 'buildChanged');

    this.builds = new Travis.Collections.Builds([new Travis.Models.Build(attributes.last_build)], { repository: this });
    this.builds.bind('add', this.buildAdded);
    this.builds.bind('change', this.buildChanged);

    delete this.attributes.last_build;
  },
  set: function(attributes) {
    attributes = _.clone(attributes);
    var build = attributes.last_build;
    delete attributes.last_build;
    if(this.builds) {
      this.builds.set(build);
    }
    Backbone.Model.prototype.set.apply(this, [attributes]);
  },
  isBuilding: function() {
    var build = this.builds.last();
    return build ? !build.get('finished_at') : false;
  },
  toJSON: function(options) {
    var data = Backbone.Model.prototype.toJSON.apply(this)
    if(options == undefined) options = { includeBuild: true }
    return options.includeBuild ? _.extend(data, { build: this.builds.last().toJSON() }) : data;
  },
  buildAdded: function(build) {
    this.trigger('build:add', build);
    this.collection.trigger('build:add', build);
  },
  buildChanged: function(build) {
    this.trigger('build:change', build);
    this.collection.trigger('build:change', build);
  }
});

Travis.Collections.Repositories = Backbone.Collection.extend({
  model: Travis.Models.Repository,
  initialize: function(models) {
    _.bindAll(this, 'find', 'last', 'update');
  },
  url: function() {
    var url = '/repositories';
    return '/repositories' + Travis.Helpers.Util.queryString(this.args);
  },
  building: function() {
    return this.select(function(repository) { return repository.isBuilding(); });
  },
  fetch: function(args) {
    args = args || {};
    this.args = { username: args.username };
    this.trigger('repositories:load:start');
    var success = args.success;
    args.success = function() { this.trigger('repositories:load:done'); if(success) success(arguments); }.bind(this);
    Backbone.Collection.prototype.fetch.apply(this, [args]);
  },
  findByName: function(name) {
    return this.detect(function(item) { return item.get('name') == name }, this); // TODO use an index?
  },
  last: function() {
    return this.models[this.models.length - 1];
  },
  update: function(data) {
    var attributes = data.repository;
    attributes.last_build = _.clone(data);
    delete attributes.last_build.repository;
    var repository = this.get(attributes.id);
    repository ? repository.set(attributes) : this.add(new Travis.Models.Repository(attributes));
    this.sort(); // triggers refresh event
  },
  comparator: function(repository) {
    return repository.builds.last().get('started_at');
  }
});

