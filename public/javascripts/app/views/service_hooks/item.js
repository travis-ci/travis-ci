Travis.Views.ServiceHooks.Item = Backbone.View.extend({
  events: {
    'click a.toggle_enabled': 'toggleEnabled'
  },
  initialize: function() {
    _.bindAll(this, 'render', 'toggleEnabled', 'onToggle');
    this.template = Travis.templates['repositories/my_item'];
  },
  render: function() {
    this.el = $(this.template(this.model.toJSON()));
    this.delegateEvents()
    return this;
  },
  toggleEnabled: function(e) {
    e.preventDefault()
    this.model.save( { is_active: !this.model.get('is_active'), id: -1 }, {
      success: this.onToggle
    })
  },
  onToggle: function(model, resp) {
    console.log(this.model.get('is_active'))
    if (this.model.get('is_active'))
      this.el.find('.toggle_enabled').addClass('on')
    else
      this.el.find('.toggle_enabled').removeClass('on')
  }
});
