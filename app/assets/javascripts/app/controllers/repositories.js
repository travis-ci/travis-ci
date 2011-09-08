//= require app/controllers/tabs.js

Travis.Controllers.Repositories = SC.ArrayController.extend({
  tabs: Travis.Controllers.Tabs.create({
    selector: '#left',
    tabs: {
      'recent': { templateName: 'app/templates/repositories/list', contentBinding: 'controller' },
      'yours':  { templateName: 'app/templates/repositories/list', contentBinding: 'controller' },
      'search': { templateName: 'app/templates/repositories/list', contentBinding: 'controller' },
    }
  }),

  searchBox: SC.TextField.create({
  }),

  init: function() {
    this.searchBox.appendTo('#search_box');
    this.tabs.set('controller', this);
  },

  recent: function() {
    this.tabs.activate('recent');
    this.set('content', Travis.Repository.recent())
  },

  search: function() {
    this.tabs.activate('search');
    this.set('content', Travis.Repository.search(this.searchBox.value));
  },

  searchObserver: function() {
    this[this.searchBox.value ? 'search' : 'recent']();
  }.observes('searchBox.value')
});
