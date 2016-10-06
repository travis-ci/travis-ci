Travis.Models.Worker = Backbone.Model.extend({
  initialize: function(attributes) {
  }
});

Travis.Collections.Workers = Backbone.Collection.extend({
  model: Travis.Models.Worker,
  url: '/workers',
  remove: function(element) {
    Backbone.Collection.prototype.remove.apply(this, [this.get(element.id)]);
  },
  comparator: function(worker) {
    return worker.get('id');
  }
});
