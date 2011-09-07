Travis.Controllers.Repository = SC.Object.extend({
  init: function() {
    var view = SC.View.create({
      controller: this,
      template: SC.TEMPLATES['app/templates/repositories/show']
    });
    view.appendTo('#main');
    this.tabs = Travis.Controllers.Tabs.create({ main: this });
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
    this.tabs.toggleParentTab(!!this.getPath('build.parentId'));
  }.observes('build.status'),
});
