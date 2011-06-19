Travis.Models.Repository = Travis.Models.Base.extend({
  initialize: function() {
    Travis.Models.Base.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'color', 'toJSON');
    this.builds = this.builds || new Travis.Collections.Builds([], { repository: this });
  },
  url: function() {
    if (this.id) {
      return '/repositories/' + this.id;
    } else {
      return '/repositories'
    }
  },
  set: function(attributes) { // TODO rename to update, add unit tests
    this.builds = this.builds || new Travis.Collections.Builds([], { repository: this });
    if(attributes.build) this.builds.update(attributes.build);
    delete attributes.build;
    Backbone.Model.prototype.set.apply(this, [attributes]);
    return this;
  },
  color: function() {
    var status = this.get('last_build_status');
    return status == 0 ? 'green' : status == 1 ? 'red' : null;
  },
  last_build_duration: function() {
    return Utils.duration(this.get('last_build_started_at'), this.get('last_build_finished_at'));
  },
  toJSON: function(options) {
    return _.extend(Backbone.Model.prototype.toJSON.apply(this), {
      color: this.color(),
      last_build_duration: this.last_build_duration()
    });
  },
});

Travis.Collections.Repositories = Travis.Collections.Base.extend({
  model: Travis.Models.Repository,
  initialize: function(models) {
    Travis.Collections.Base.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'url', 'update');
  },
  url: function() {
    return '/repositories' + Utils.queryString(this.options);
  },
  update: function(attributes) {
    attributes = _.extend(_.clone(attributes), { build: _.clone(attributes.build) });
    var repository = this.get(attributes.id);
    repository ? repository.set(attributes) : this.add(new Travis.Models.Repository(attributes));
  },
  comparator: function(repository) {
    return repository.get('last_build_started_at');
  }
});

