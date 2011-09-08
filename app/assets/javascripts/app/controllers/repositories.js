//= require app/controllers/tabs.js

Travis.Controllers.Repositories = SC.Object.extend({
  tabs: Travis.Controllers.Tabs.create({
    selector: '#left',
    tabs: {
      'recent': { templateName: 'app/templates/repositories/list', contentBinding: 'controller.recent' },
      'yours':  { templateName: 'app/templates/repositories/list', contentBinding: 'controller.yours'  },
      'search': { templateName: 'app/templates/repositories/list', contentBinding: 'controller.search' },
    }
  }),

  searchBox: SC.TextField.create({
  }),

  init: function() {
    this.searchBox.appendTo('#search_box');
    this.tabs.controller = this;
    this.tabs.activate('recent');
  },

  recent: function() {
    return Travis.Repository.recent();
  }.property(),

  search: function() {
    // return Travis.Repository.search(this.searchBox.value);
  }.property(),

  searchObserver: function() {
    this.tabs.activate(this.searchBox.value ? 'search' : 'recent')
  }.observes('searchBox.value')
});
