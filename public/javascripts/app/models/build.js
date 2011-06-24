Travis.Models.Build = Travis.Models.Base.extend({
  initialize: function(attributes, options) {
    Travis.Models.Base.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'update', 'updateMatrix', 'url', 'commit', 'color', 'duration', 'eta', 'toJSON');
    _.extend(this, options);

    this.repository = this.repository;
    if(!this.repository && this.collection) this.repository = this.collection.repository;
    if(!this.repository && Travis.app) this.repository = Travis.app.repositories.get(this.get('repository_id'));

    if(this.attributes._log) {
      this.appendLog(this.attributes._log);
      delete this.attributes._log;
    }
    if(this.attributes.matrix) {
      this.updateMatrix(this.attributes);
    }
    if(this.collection) {
      this.bind('change', function(build) { this.collection.trigger('change', this); });
      this.bind('configured', function(build) { this.collection.trigger('configured', build); });
    }
  },
  update: function(attributes) {
    this.set(attributes);
    if(this.attributes._log) {
      this.appendLog(this.attributes._log);
      delete this.attributes._log;
    }
    if(attributes.matrix) {
      this.updateMatrix(attributes);
    }
    return this;
  },
  updateMatrix: function(attributes) {
    if(this.matrix) {
      _.each(attributes.matrix, function(attributes) { this.matrix.update(attributes) }.bind(this));
    } else {
      this.matrix = new Travis.Collections.Builds(attributes.matrix, { repository: this.repository });
      this.matrix.parent = this;
      this.matrix.each(function(build) { build.repository = this.repository }.bind(this)); // wtf
      this.matrix.bind('select', function(build) { this.trigger('select', build); }.bind(this))
      this.trigger('configured', this);
    }
    delete attributes.matrix;
  },
  parent: function(callback) {
    if(this.get('parent_id')) {
      this.collection.parent.collection.getOrFetch(this.get('parent_id'), callback);
    }
  },
  appendLog: function(chars) {
    this.attributes.log = (this.attributes.log || '') + chars;
    this.trigger('append:log', chars);
  },
  url: function() {
    return '/builds/' + this.id;
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
    return Utils.duration(this.get('started_at'), this.get('finished_at'));
  },
  eta: function() {
    var startedAt  = this.get('started_at');
    var finishedAt = this.get('finished_at');
    var lastDuration = this.repository.get('last_duration');
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
      repository: this.repository.toJSON(),
    });
    if(this.matrix) {
      json['matrix'] = this.matrix.toJSON();
    }
    if(this.get('config')) {
      var humanReadableConfig = {}
      _.map(this.get('config'), function(v, k) {
        if (_.include(Travis.DISPLAYED_KEYS, k)) {
          humanReadableConfig[k] = v
        }
      })
      json['config_table'] = _.map(humanReadableConfig, function(value, key) { return { key: key, value: value } } );
      json['config'] = _.map(humanReadableConfig, function(value, key) { return key + ': ' + value; } ).join(', ');
    }
    return json;
  }
});

Travis.Collections.Builds = Travis.Collections.Base.extend({
  model: Travis.Models.Build,
  initialize: function(models, options) {
    Travis.Collections.Base.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'url', 'dimensions', 'update');
    _.extend(this, options);
  },
  _add: function(model, options) {
    Travis.Collections.Base.prototype._add.apply(this, arguments);
    if(Travis.app) Travis.app.builds._add(model);
  },
  update: function(attributes) {
    if(attributes) {
      var build = this.get(attributes.id);
      build ? build.update(attributes) : this.add(new Travis.Models.Build(attributes, { repository: this.repository }));
    }
  },
  url: function() {
    return '/repositories/' + this.repository.id + '/builds' + Utils.queryString(this.args);
  },
  dimensions: function() {
    return this.models[0] ?
      _.select(_(this.models[0].get('config')).keys(), function(key) {
        return _.include(Travis.DISPLAYED_KEYS, key)
      }).map(function(key) {
        return _.capitalize(key)
      }) : [];
  },
  comparator: function(build) {
    // this sorts matrix child builds below their child builds, i.e. the actual order will be like: 4, 3, 3.1, 3.2, 3.3., 2, 1
    var number = parseInt(build.get('number'));
    var fraction = parseFloat(build.get('number')) - number;
    return number - fraction;
  }
});

Travis.Collections.AllBuilds = Travis.Collections.Builds.extend({
  _add: function(model, options) {
    var cid = model.cid;
    var collection = model.collection;
    Travis.Collections.Base.prototype._add.apply(this, arguments);
    model.collection = collection;
    model.cid = cid;
    return this;
  },
})

