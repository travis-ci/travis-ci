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
    this.tabs.controller = this;
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
