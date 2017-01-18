Travis.Views.ServiceHooks.Item = Backbone.View.extend({
  events: {
    'click a.toggle_enabled': 'toggleEnabled'
  },
  initialize: function() {
    _.bindAll(this, 'render', 'toggleEnabled', 'onToggle', 'toggleModelBack');
    this.template = Travis.templates['repositories/service_hook'];
  },
  render: function() {
    this.el = $(this.template(this.model.toJSON()));
    this.delegateEvents()
    return this;
  },
  toggleEnabled: function(e) {
    e.preventDefault()
    this.model.save( { is_active: !this.model.get('is_active'), id: -1 }, {
      success: this.onToggle,
      error: this.toggleModelBack
    })
  },
  // We do not receive current model status from server, since we're using 'update' rather than create.
  // So we need to toggle model in previous state ourselves
  toggleModelBack: function(model, resp) {
    this.model.set({ is_active: !this.model.get('is_active') })
  },
  onToggle: function(model, resp) {
    if (this.model.get('is_active'))
      this.el.find('.toggle_enabled').addClass('on')
    else
      this.el.find('.toggle_enabled').removeClass('on')
  }
});
