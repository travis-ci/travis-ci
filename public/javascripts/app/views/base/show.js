// Base component for displaying a single model
//
Travis.Views.Base.Show = Backbone.View.extend({
  initialize: function(args) {
    _.bindAll(this, 'element', 'render', 'connect', 'disconnect', '_bind', '_unbind');

    this.selectors = this.selectors || { element: '#' + this.name };
    this.templates = this.templates || { show: args.templates[this.name], };
    this.model_events = this.model_events || {};

    this.render();
    return this;
  },
  element: function() {
    return $(this.selectors.element);
  },
  render: function() {
    this.element().html(this.templates.show({}));
    // this.element().addClass('loading');
  },
  connected: function() {
    return !!this.model;
  },
  connect: function(model) {
    this.disconnect();
    this.model = model;
    this._bind(model, this.model_events);
  },
  disconnect: function() {
    if(this.model) {
      this._unbind(this.model, this.model_events);
      delete this.model;
      delete this._element;
    }
  },
  _bind: function(target, events) {
    _.each(events, function(callback, name) { target.bind(name, this[callback]); }.bind(this));
  },
  _unbind: function(target, events) {
    _.each(events, function(callback, name) { target.unbind(name); }.bind(this));
  }
});


