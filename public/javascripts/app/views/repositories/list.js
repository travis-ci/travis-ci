Travis.Views.Repositories.List = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'elementAdded', 'update');
  },
  detach: function() {
    if(this.collection) {
      this.collection.unbind('add', this.elementAdded);
      this.collection.unbind('refresh', this.update);
    }
  },
  attachTo: function(collection) {
    this.detach();
    this.collection = collection;
    this.collection.bind('add', this.elementAdded);
    this.collection.bind('refresh', this.update);
  },
  render: function() {
  },
  elementAdded: function(element) {
    this.el.prepend(this.renderItem(element));
  },
  update: function() {
    this.collection.each(function(element) {
      this.el.prepend(this.renderItem(element));
    }.bind(this));
  },
  renderItem: function(element) {
    return new Travis.Views.Repositories.Item({ model: element }).render().el
  }
});
