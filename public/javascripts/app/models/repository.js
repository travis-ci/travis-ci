var Repository = Backbone.Model.extend({
  initialize: function(attributes) {
    _.bindAll(this, 'build_added', 'build_changed');

    this.builds = new Builds([new Build(attributes.last_build)], { repository: this });
    this.builds.bind('add', this.build_added);
    this.builds.bind('change', this.build_changed);

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
  },
  build_added: function(build) {
    this.trigger('build:add', build);
    this.collection.trigger('build:add', build);
  },
  build_changed: function(build) {
    this.trigger('build:change', build);
    this.collection.trigger('build:change', build);
  }
});

var Repositories = Backbone.Collection.extend({
  model: Repository,
  initialize: function(models) {
    _.bindAll(this, 'find', 'last', 'update');
  },
  url: function() {
    var url = '/repositories';
    return '/repositories' + Util.query_string(this.params);
  },
  fetch: function(params) {
    this.params = { username: params.username };
    Backbone.Collection.prototype.fetch.apply(this, arguments);
  },
  find_by_name: function(name) {
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
    repository ? repository.set(attributes) : this.add(new Repository(attributes));
    this.sort(); // triggers refresh event
  },
  comparator: function(repository) {
    return repository.builds.last().get('started_at');
  }
});

