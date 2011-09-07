Travis.Views.ServiceHooks.Item = Backbone.View.extend({
  events: {
    'click a.toggle_enabled': 'toggle'
  },
  initialize: function() {
    _.bindAll(this, 'render', 'toggle', 'onToggle', 'update', 'isActive');
    this.template = Travis.templates['app/templates/repositories/service_hook'];
  },
  render: function() {
    this.el = $(this.template(this.model.toJSON()));
    this.delegateEvents()
    return this;
  },
  toggle: function(e) {
    e.preventDefault()
    this.model.set({ active: !this.isActive() });
    this.update();
    this.model.save({ id: -1 }, { error: this.toggleModelBack })
  },
  // We do not receive current model status from server, since we're using 'update' rather than create.
  // So we need to toggle model in previous state ourselves
  toggleModelBack: function(model, resp) {
    this.model.set({ active: !this.isActive() });
    this.update();
  },
  update: function(active) {
    this.el.find('.toggle_enabled')[this.isActive() ? 'addClass' : 'removeClass']('on')
  },
  isActive: function() {
    var active = this.model.get('active');
    return active = typeof active == 'boolean' ? active : active[0]; // WTF.
  }
});
