var Job = Backbone.Model.extend({
  initialize: function(attributes) {
  }
});

var Jobs = Backbone.Collection.extend({
  model: Job,
  initialize: function(jobs, options) {
    this.url = 'jobs';
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


