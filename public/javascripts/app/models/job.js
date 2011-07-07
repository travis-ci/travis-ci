Travis.Models.Job = Backbone.Model.extend({
  initialize: function(attributes) {
  }
});

Travis.Collections.Jobs = Backbone.Collection.extend({
  initialize: function(attributes) {
    this.url = '/jobs?queue=' + attributes.queue;
  }
  model: Travis.Models.Job,
  remove: function(element) {
    Backbone.Collection.prototype.remove.apply(this, [this.get(element.id)]);
  },
  comparator: function(job) {
    return job.get('id');
  }
});
