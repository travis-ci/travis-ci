Travis.Views.Build.Log = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'render', 'setLog', 'appendLog');
    this.template = Travis.templates['build/log'];
    if(this.model) this.attachTo(this.model);
  },
  detach: function() {
    if(this.model) {
      this.model.unbind('change:log', this.setLog);
      this.model.unbind('append:log', this.appendLog);
      delete this.model;
    }
  },
  attachTo: function(model) {
    this.detach();
    this.model = model;
    this.model.bind('change:log', this.setLog)
    this.model.bind('append:log', this.appendLog)
  },
  render: function() {
    this.el = $(this.template({ log: this.model.get('log') || '' }));
    this.el.filterLog();
    return this;
  },
  setLog: function() {
    this.el.text(this.model.get('log') || '');
    this.el.filterLog();
  },
  appendLog: function(chars) {
    if(chars) {
      this.el.append(chars);
      this.el.filterLog();
    }
  }
});
