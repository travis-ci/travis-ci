Travis.Controllers.ServiceHooks = Ember.ArrayController.extend({
  init: function() {
    this.view = Travis.View.create({
      service_hooks: this,
      template: Ember.TEMPLATES['app/templates/service_hooks/list']
    });
    this.view.appendTo('#service_hooks');
    this.set('content', Travis.ServiceHook.all({ orderBy: 'active DESC, name' }));
  },

  state: function() {
    return this.get('active') ? 'on' : 'off';
  }.property('active'),

  githubUrl: function() {
    return '%@/admin/hooks#travis_minibucket'.fmt(this.get('url'));
  }.property('url')
});

