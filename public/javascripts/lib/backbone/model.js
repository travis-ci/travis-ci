Travis.Models.Base = Backbone.Model.extend({
  initialize: function() {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'select', 'deselect');
  },
  select: function() {
    this.collection.deselect();
    this.set({ selected: true });
    this.collection.trigger('select', this);
  },
  deselect: function() {
    this.set({ selected: false });
    this.collection.trigger('deselect', this);
  },
});

