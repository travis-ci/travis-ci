//= require app/controllers/tabs.js

Travis.Controllers.Repositories.List = Ember.ArrayController.extend({
  searchBox: Ember.TextField.create({
  }),

  init: function() {
    Ember.run.later(this.updateTimes.bind(this), Travis.UPDATE_TIMES_INTERVAL);

    this.tabs = Travis.Controllers.Tabs.create({
      selector: '#left',
      parent: this
    });

    this.view = Ember.View.create({
      repositories: this,
      templateName: 'app/templates/repositories/list'
    });
    this.view.appendTo('#left');

    this.searchBox.appendTo('#search_box');
    this.recent();
  },

  recent: function() {
    this.set('content', Travis.Repository.recent());
    this.tabs.activate('recent');
  },

  owned_by: function(githubId) {
    this.set('content', Travis.Repository.owned_by(githubId));
    this.tabs.activate('my_repositories');
  },

  search: function() {
    this.set('content', Travis.Repository.search(this.searchBox.value));
    this.tabs.activate('search');
  },

  searchObserver: function() {
    this[this.searchBox.value ? 'search' : 'recent']();
    this.tabs.setDisplay('search', this.searchBox.value);
  }.observes('searchBox.value'),

  updateTimes: function() {
    var repositories  = this.get('content');
    if(repositories) repositories.forEach(function(repository) { repository.updateTimes(); }.bind(this));

    Ember.run.later(this.updateTimes.bind(this), Travis.UPDATE_TIMES_INTERVAL);
  }
});
