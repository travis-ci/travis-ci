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

  _setBuildFromRepository: function() {
    var id = this.getPath('params.id');
    if(!id) this.set('build', this.getPath('repository.lastBuild'));
  }.observes('params.id', 'repository.lastBuild'),

  _setBuildFromId: function() {
    var id = this.getPath('params.id');
    if(id) this.set('build', Travis.Build.find(id));
  }.observes('params.id'),

  _buildObserver: function() {
    var build = this.get('build');
    if(build.get('status') & SC.Record.READY && this.getPath('build.matrix.length') == 1) {
      var build = this.getPath('build.matrix').objectAt(0);
      this.set('build', build);
      if(build.get('state') != 'finished') {
        console.log('subscribe!');
        pusher.subscribe('build:' + build.get('id')).bind_all(Travis.receive);
      }
    }
    this.tabs.toggle('parent', this.getPath('params.id') && this.getPath('build.parentId'));
  }.observes('build.status'),
});
