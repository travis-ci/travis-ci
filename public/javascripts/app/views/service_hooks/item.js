Travis.Views.ServiceHooks.Item = Backbone.View.extend({
  events: {
    'click a.toggle_enabled': 'toggleEnabled'
  },
  initialize: function() {
    _.bindAll(this, 'render', 'toggleEnabled', 'onToggle');
    this.template = Travis.templates['repositories/my_item'];
  },
  render: function(csrfToken) {
    this.model.set({ authenticity_token: csrfToken });
    this.el = $(this.template(this.model.toJSON()));
    this.delegateEvents()
    return this;
  },
  toggleEnabled: function(e) {
    e.preventDefault()
    if (this.model.get('is_active'))
      this.model.destroy({
        success: this.onToggle
      })
    else
      this.model.save({}, {
        success: this.onToggle
      })
  },
  onToggle: function(model, resp) {
    if (this.model.get('is_active'))
      this.el.find('.toggle_enabled').addClass('on')
    else
      this.el.find('.toggle_enabled').removeClass('on')
  }
});
