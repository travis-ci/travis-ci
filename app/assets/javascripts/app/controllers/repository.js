//= require app/controllers/tabs.js

Travis.Controllers.Repository = SC.Object.extend({
  tabs: Travis.Controllers.Tabs.create({
    selector: '#repository',
    tabs: {
      'current': { templateName: 'app/templates/builds/show', buildBinding:  'controller.repository.lastBuild' },
      'history': { templateName: 'app/templates/builds/list', buildsBinding: 'controller.repository.builds' },
      'build':   { templateName: 'app/templates/builds/show', buildBinding:  'controller.build' },
    }
  }),

  init: function() {
    this.tabs.controller = this;

    var view = SC.View.create({
      controller: this,
      template: SC.TEMPLATES['app/templates/repositories/show']
    });
    view.appendTo('#main');
  },

  activate: function(tab, params) {
    this.tabs.activate(tab);
    this.set('params', params);
  },

  repositoryBinding: 'repositories.firstObject',

  repositories: function() {
    var slug = $.compact([this.getPath('params.owner'), this.getPath('params.name')]).join('/');
    return slug.length > 0 ? Travis.Repository.bySlug(slug) : Travis.Repository.recent();
  }.property('params'),

  build: function() {
    if(this.getPath('params.id')) return Travis.Build.find(this.getPath('params.id'));
  }.property('params'),

  buildObserver: function() {
    this.tabs.toggle('parent', !!this.getPath('build.parentId'));
  }.observes('build.status'),
});
