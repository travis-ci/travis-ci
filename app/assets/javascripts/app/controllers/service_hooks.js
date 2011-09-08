Travis.Controllers.ServiceHooks = SC.ArrayController.extend({
  init: function() {
    this.view = SC.View.create({
      service_hooks: this,
      template: SC.TEMPLATES['app/templates/service_hooks/list']
    })
    this.view.appendTo('#service_hooks');
    this.set('content', Travis.ServiceHook.all({ orderBy: 'active DESC, name' }));
  },

  state: function() {
    return this.get('active') ? 'on' : 'off';
  }.property('active'),

  githubUrl: function() {
    return '%@/admin/hooks#travis_minibucket'.fmt(this.get('url'));
  }.property('url'),
});

