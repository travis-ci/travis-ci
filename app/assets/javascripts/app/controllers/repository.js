//= require app/controllers/tabs.js
//= require app/views.js

Travis.Controllers.Repository = SC.Object.extend({
  tabs: Travis.Controllers.Tabs.create({
    selector: '#repository',
    views: {
      current: Travis.Views.Builds.Current,
      history: Travis.Views.Builds.List,
      build:   Travis.Views.Builds.Show,
    }
  }),

  init: function() {
    this.tabs.controller = this;
    this.view = Travis.Views.Repositories.Show.create({ controller: this });
  },

  activate: function(tab, params) {
    if (this.view.state != "inDOM") {
      // TODO : add an object that removes any controller already present in the page
      // So we could have several different main views to load.
      Travis.home.view.remove();
      this.view.appendTo('#main');
    }

    this.set('params', params);
    this.tabs.activate(tab);
  },

  currentBinding:    'repository.lastBuild',
  buildsBinding:     'repository.builds',
  repositoryBinding: 'repositories.firstObject',

  repositories: function() {
    var slug = $.compact([this.getPath('params.owner'), this.getPath('params.name')]).join('/');
    return slug.length > 0 ? Travis.Repository.bySlug(slug) : Travis.Repository.recent();
  }.property('params'),

  paramsObserver: function() {
    var id = this.getPath('params.id');
    if(id) this.set('build', Travis.Build.find(id));
  }.observes('params'),

  buildObserver: function() {
    this.tabs.toggle('parent', !!this.getPath('build.parentId'));
  }.observes('build.parentId'),
});
