Travis.Models.Job = Backbone.Model.extend({
  initialize: function(attributes) {
  }
});

Travis.Collections.Jobs = Backbone.Collection.extend({
  initialize: function(elements, args) {
    this.queue = args.queue || 'builds'
  },
  url: function() {
    return this.queue ? '/jobs?queue=' + this.queue : '/jobs';
  },
  model: Travis.Models.Job,
  remove: function(element) {
    Backbone.Collection.prototype.remove.apply(this, [this.get(element.id)]);
  },
  comparator: function(job) {
    return job.get('id');
  }
});
