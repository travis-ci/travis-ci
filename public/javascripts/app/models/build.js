var Build = Backbone.Model.extend({
  initialize: function(attributes) {
    _.bindAll(this, 'toJSON');
    Backbone.Model.prototype.initialize.apply(this, arguments);
  },
  duration: function() {
    var started_at  = this.get('started_at');
    var finished_at = this.get('finished_at');
    var last_duration = this.repository.get('last_duration');

    if (started_at && finished_at) {
      return Math.round((new Date(finished_at) - new Date(started_at)) / 1000);
    } else if (started_at) {
      return Math.round((new Date - new Date(started_at)) / 1000);
    } else {
      return 0;
    }
  },
  eta: function() {
    var started_at  = this.get('started_at');
    var finished_at = this.get('finished_at');
    var last_duration = this.repository.get('last_duration');

    if(finished_at) {
      return null;
    } else if(last_duration) {
      var timestamp = new Date(started_at).getTime();
      var eta = new Date((timestamp + last_duration));
      return eta.toISOString();
    }
  },
  toJSON: function() {
    return _.extend(Backbone.Model.prototype.toJSON.apply(this), {
      duration: this.duration(),
      eta: this.eta(),
    });
  }
});

var Builds = Backbone.Collection.extend({
  url: '/builds',
  model: Build,
  initialize: function(repositories) {
    _.bindAll(this, 'retrieve');
    this.repositories = repositories;
  },
  retrieve: function(id, callback) {
    var build = new Build({ id: id });
    this.add(build);
    build.fetch({ success: callback });
  }
});
