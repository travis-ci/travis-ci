Travis.Models.Build = Backbone.Model.extend({
  initialize: function(attributes, options) {
    _.bindAll(this, 'repository', 'isBuilding', 'color', 'duration', 'eta', 'toJSON');

    if(this.attributes.matrix) {
      this.matrix = new Travis.Collections.Builds(this.attributes.matrix, { parent: this, repository: options.repository });
      delete this.attributes.matrix;
    }

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
  isBuilding: function() {
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
    var startedAt  = this.get('started_at');
    var finishedAt = this.get('finished_at') || new Date;
    return startedAt ? Math.round((new Date(finishedAt) - new Date(startedAt)) / 1000) : 0;
  },
  eta: function() {
    var startedAt  = this.get('started_at');
    var finishedAt = this.get('finished_at');
    var lastDuration = this.repository().get('last_duration');
    if(!finishedAt && lastDuration) {
      var timestamp = new Date(startedAt).getTime();
      var eta = new Date((timestamp + lastDuration));
      return eta.toISOString();
    }
  },
  toJSON: function() {
    var json = _.extend(Backbone.Model.prototype.toJSON.apply(this), {
      duration: this.duration(),
      commit: this.commit(),
      eta: this.eta(),
      color: this.color(),
      repository: this.repository().toJSON({ includeBuild: false }),
    });
    if(this.matrix) {
      json['matrix'] = this.matrix.toJSON();
    }
    if(this.get('config')) {
      json['config'] = _.map(this.get('config'), function(value, key) { return { key: key, value: value } } );
    }
    return json;
  }
});

Travis.Collections.Builds = Backbone.Collection.extend({
  model: Travis.Models.Build,
  initialize: function(builds, options) {
    _.bindAll(this, 'load', 'retrieve');
    this.repository = options.repository;
    this.parent = options.parent;
    this.url = 'repositories/' + this.repository.id + '/builds';
  },
  dimensions: function() {
    return this.models[0] ? _.keys(this.models[0].get('config')) : [];
  },
  set: function(attributes) {
    if(attributes) {
      var build = this.get(attributes.id);
      build ? build.set(attributes) : this.add(new Travis.Models.Build(attributes, { repository: this.repository }));
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
      var build = new Travis.Models.Build({ id: id });
      this.add(build);
      build.fetch({ silent: true, success: callback });
    }
  },
  comparator: function(build) {
    return build.get('number');
  }
});
