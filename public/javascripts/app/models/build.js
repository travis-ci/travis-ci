Travis.Models.Build = Travis.Models.Base.extend({
  initialize: function(attributes, options) {
    _.bindAll(this, 'color', 'duration', 'eta', 'toJSON');
    _.extend(this, options);

    this.repository = this.repository || this.collection.repository;

    if(this.attributes.matrix) {
      this.matrix = new Travis.Collections.Builds(this.attributes.matrix, { repository: this.repository });
      this.matrix.each(function(build) { build.repository = this.repository }.bind(this)); // wtf
      delete this.attributes.matrix;
    }

    if(this.collection) {
      this.bind('change', function(build) { this.collection.trigger('change', this); });
    }
  },
  url: function() {
    return 'builds/' + this.id;
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
      json['config'] = _.map(this.get('config'), function(value, key) { return { key: key, value: value } } );
    }
    return json;
  }
});

Travis.Collections.Builds = Travis.Collections.Base.extend({
  model: Travis.Models.Build,
  initialize: function(models, options) {
    _.extend(this, options);
  },
  url: function() {
    return '/repositories/' + this.repository.id + '/builds' + Util.queryString(this.args);
  },
});
