Travis.Views.Build.Log = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'render', 'setLog');
    this.template = Travis.app.templates['build/log'];
    this.model.bind('change:log', this.setLog)
  },
  render: function() {
    this.el = $(this.template({ log: this.model.get('log') }));
    return this;
  },
  setLog: function() {
    this.el.text(this.model.get('log'));
  }
});
