//= require app/controllers/tabs.js
//= require app/views.js

Travis.Controllers.Repositories = SC.ArrayController.extend({
  tabs: Travis.Controllers.Tabs.create({
    selector: '#left',
    views: {
      recent: Travis.Views.Repositories.List,
      search: Travis.Views.Repositories.List
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
