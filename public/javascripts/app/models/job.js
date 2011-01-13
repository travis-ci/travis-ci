// {
//   "number":22,
//   "enqueued_at":"2011-01-13T00:40:02.139861Z",
//   "commit":"5329b9b8bf206344f685359c5e60eb9f10400dc9",
//   "repository":{"name":"svenfuchs/minimal","url":"https://github.com/svenfuchs/minimal","id":7},
//   "meta_id":"ddcfedeb38a092c7e533871796527e50327dc1fe",
//   "id":95
// }
var Job = Backbone.Model.extend({
  initialize: function(attributes) {
  }
});

var Jobs = Backbone.Collection.extend({
  model: Job,
  initialize: function(jobs, options) {
    _.bindAll(this, 'add', 'remove');
    this.url = 'jobs';
  },
  remove: function(attributes) {
    Backbone.Collection.prototype.remove.apply(this, [this.get(attributes.id)]);
  },
  load: function(callback) {
    Backbone.sync('read', this, function(models, status, xhr) {
      _.each(models, function(model) { if(!this.get(model.id)) { this.add(model, { silent: true }); } }.bind(this));
      if(callback) callback(this);
    }.bind(this));
  },
  comparator: function(job) {
    return job.get('enqueued_at');
  }
});


