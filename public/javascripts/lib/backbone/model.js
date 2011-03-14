Travis.Models.Base = Backbone.Model.extend({
  selected: false,
  initialize: function() {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'select', 'deselect');
  },
  select: function() {
    this.collection.deselect();
    this.selected = true;
    this.collection.trigger('select', this);
  },
  deselect: function() {
    this.selected = false;
    this.collection.trigger('deselect', this);
  },
});

