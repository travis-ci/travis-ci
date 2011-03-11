Travis.Views.Build.Log = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'render', 'setLog', 'appendLog');
    this.template = Travis.app.templates['build/log'];
    // this.model.bind('change:log', this.setLog)
    this.model.bind('append:log', this.appendLog)
  },
  render: function() {
    this.el = $(this.template({ log: this.model.get('log') }));
    return this;
  },
  setLog: function() {
    this.el.text(this.model.get('log'));
    this.el.deansi();
  },
  appendLog: function(chars) {
    this.el.append(chars);
    this.el.deansi();
  }
});
