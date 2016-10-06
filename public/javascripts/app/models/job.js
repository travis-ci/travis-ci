Travis.Models.Job = Backbone.Model.extend({
  initialize: function(attributes) {
  }
});

Travis.Collections.Jobs = Backbone.Collection.extend({
  model: Travis.Models.Job,
  url: '/jobs',
  remove: function(element) {
    Backbone.Collection.prototype.remove.apply(this, [this.get(element.id)]);
  },
  comparator: function(job) {
    return job.get('id');
  }
});
