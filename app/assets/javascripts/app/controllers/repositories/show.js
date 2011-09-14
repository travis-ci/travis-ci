//= require app/controllers/tabs.js
//= require app/views.js

Travis.Controllers.Repositories.Show = SC.Object.extend({
  tabs: Travis.Controllers.Tabs.create({
    selector: '#repository',
    tabs: {
      current: Travis.Controllers.Builds.Show,
      history: Travis.Controllers.Builds.List,
      build:   Travis.Controllers.Builds.Show,
    }
  }),

  repositoryBinding: '_repositories.firstObject',

  init: function() {
    this.tabs.parent = this;
    this.view = Travis.View.create({
      controller: this,
      repositoryBinding: 'controller.repository',
      buildBinding: 'controller.build',
      templateName: 'app/templates/repositories/show'
    });
    this.view.appendTo('#main');
  },

  activate: function(tab, params) {
    this.set('params', params);

    if(params.id) {
      this.set('build', Travis.Build.find(params.id));
    } else {
      this.bind('build', 'repository.lastBuild');
    }

    this.tabs.activate(tab);
  },

  _repositories: function() {
    var slug = this.get('_slug');
    return slug ? Travis.Repository.bySlug(slug) : Travis.Repository.recent();
  }.property('_slug'),

  _slug: function() {
    var parts = $.compact([this.getPath('params.owner'), this.getPath('params.name')]);
    if(parts.length > 0) return parts.join('/');
  }.property('params'),

  buildObserver: function() {
    this.tabs.toggle('parent', !!this.getPath('build.parentId'));
  }.observes('build.parentId'),
});
