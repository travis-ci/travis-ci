var Build = Backbone.Model.extend({
  initialize: function() {
    _.bindAll(this, 'repository', 'is_building', 'color', 'duration', 'eta', 'toJSON');
    this.bind('change', function(build) { this.collection.trigger('change', this); });
  },
  repository: function() {
    return this.collection.repository;
  },
  set: function(attributes, options) {
    if(attributes.append_log) {
      var chars = attributes.append_log;
      this.attributes.log = this.attributes.log + chars;
      this.trigger('log', this, chars);
      delete attributes.append_log;
    }
    return Backbone.Model.prototype.set.apply(this, [attributes, options]);
  },
  is_building: function() {
    return !this.get('finished_at');
  },
  commit: function() {
    var commit = this.get('commit');
    return commit ? commit.slice(0, 7) : '';
  },
  color: function() {
    var status = this.get('status');
    return status == 0 ? 'green' : status == 1 ? 'red' : null;
  },
  duration: function() {
    var started_at  = this.get('started_at');
    var finished_at = this.get('finished_at') || new Date;
    var last_duration = this.repository().get('last_duration');
    return started_at ? Math.round((new Date(finished_at) - new Date(started_at)) / 1000) : 0;
  },
  eta: function() {
    var started_at  = this.get('started_at');
    var finished_at = this.get('finished_at');
    var last_duration = this.repository().get('last_duration');
    if(!finished_at && last_duration) {
      var timestamp = new Date(started_at).getTime();
      var eta = new Date((timestamp + last_duration));
      return eta.toISOString();
    }
  },
  toJSON: function() {
    return _.extend(Backbone.Model.prototype.toJSON.apply(this), {
      duration: this.duration(),
      commit: this.commit(),
      eta: this.eta(),
      color: this.color(),
      repository: this.repository().toJSON({ include_build: false })
    });
  }
});

var Builds = Backbone.Collection.extend({
  model: Build,
  initialize: function(builds, options) {
    _.bindAll(this, 'load', 'retrieve');
    this.repository = options.repository;
    this.url = 'repositories/' + this.repository.id + '/builds';
  },
  set: function(attributes) {
    if(attributes) {
      var build = this.get(attributes.id);
      build ? build.set(attributes) : this.add(new Build(attributes));
    }
  },
  last: function() {
    return this.models[this.models.length - 1];
  },
  load: function(callback) {
    this.trigger('builds:load:start');
    Backbone.sync('read', this, function(models, status, xhr) {
      _.each(models, function(model) { if(!this.get(model.id)) { this.add(model, { silent: true }); } }.bind(this));
      this.trigger('builds:load:done');
      if(callback) callback(this);
    }.bind(this));
  },
  retrieve: function(id, callback) {
    var build = this.get(id);
    if(build) {
      callback(build);
    } else {
      var build = new Build({ id: id });
      this.add(build);
      build.fetch({ silent: true, success: callback });
    }
  },
  comparator: function(build) {
    return build.get('number');
  }
});
