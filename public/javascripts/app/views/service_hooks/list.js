Travis.Views.ServiceHooks.List = Backbone.View.extend({
  constructor: function(el, collection) {
    this.el = el
    this.collection = collection
    this.initialize()
  },
  initialize: function() {
    _.bindAll(this, 'render', 'renderItem');
    this.template = Travis.templates['repositories/service_hooks']
    this.collection.fetch({ success: this.render })
  },
  render: function() {
    this.el.html(this.template({}))
    _.each(this.collection.sortBy( function(a,b) {
      return a.get('is_active');
    }).reverse(), _.bind(function(item) {
      this.el.find("#service_hooks").append(this.renderItem(item))
    }, this))
    return this;
  },
  renderItem: function(item) {
    return new Travis.Views.ServiceHooks.Item({ model: item }).render().el
  }
});
