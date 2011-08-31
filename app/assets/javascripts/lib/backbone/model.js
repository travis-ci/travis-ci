Travis.Models.Base = Backbone.Model.extend({
  selected: false,
  initialize: function() {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'select', 'deselect');
  },
  select: function() {
    this.collection.deselect();
    this.selected = true;
    this.trigger('select', this); // Backbone will make this trigger on the collection as well
  },
  deselect: function() {
    this.selected = false;
    this.trigger('deselect', this);
  },
});

