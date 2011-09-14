//= require app/controllers/tabs.js
//= require app/views.js

    // List:    Travis.View.extend({ templateName: 'app/templates/repositories/list', repositoriesBinding: 'controller' }),
    // Show:    Travis.View.extend({ templateName: 'app/templates/repositories/show' })

Travis.Controllers.Repositories.List = SC.ArrayController.extend({
  searchBox: SC.TextField.create({
  }),

  init: function() {
    this.tabs = Travis.Controllers.Tabs.create({
      selector: '#left',
      parent: this
    });

    this.view = Travis.View.create({
      repositories: this,
      templateName: 'app/templates/repositories/list'
    });
    this.view.appendTo('#left');

    this.searchBox.appendTo('#search_box');
    this.recent();
  },

  recent: function() {
    this.set('content', Travis.Repository.recent())
    this.tabs.activate('recent');
  },

  search: function() {
    this.set('content', Travis.Repository.search(this.searchBox.value));
    this.tabs.activate('search');
  },

  searchObserver: function() {
    this[this.searchBox.value ? 'search' : 'recent']();
  }.observes('searchBox.value')
});
