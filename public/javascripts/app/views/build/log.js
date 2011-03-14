Travis.Views.Build.Log = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'render', 'setLog', 'appendLog');
    this.template = Travis.templates['build/log'];

    if(this.model) {
      this.attachTo(this.model);
    }
  },
  detach: function() {
    if(this.model) {
      this.model.unbind('append:log');
      delete this.model;
    }
  },
  attachTo: function(model) {
    this.detach();
    this.model = model;
    this.model.bind('append:log', this.appendLog)
    this.model.bind('change:log', this.setLog)
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
    if(chars) {
      this.el.append(chars);
      this.el.deansi();
    }
  }
});
