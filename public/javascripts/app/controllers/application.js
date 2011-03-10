Travis.Controllers.Application = Backbone.Controller.extend({
  templates: {},
  routes: {
    '':                             'recent',
    // '!/:username':                  'byUser',
    '!/:username/:name':            'repository',
    '!/:username/:name/builds':     'repositoryHistory',
    '!/:username/:name/builds/:id': 'repositoryBuild',
  },
  initialize: function() {
    _.bindAll(this, 'recent', 'byUser', 'repository', 'repositoryHistory', 'repositoryBuild', 'repositoryShow', 'reset', 'repositorySelected');
    this.templates = Util.loadTemplates();
  },
  run: function() {
    this.repositories = new Travis.Collections.Repositories();
    this.jobs         = new Travis.Collections.Jobs();
    this.workers      = new Travis.Collections.Workers();

    this.repositoriesList = new Travis.Views.Repositories.List({ el: $('#repositories') })
    this.repositoryShow   = new Travis.Views.Repository.Show({ el: $('#main') })
    this.workersView      = new Travis.Views.Workers.List();
    this.jobsView         = new Travis.Views.Jobs.List();

    this.repositoriesList.render();
    this.repositoryShow.render();

    this.repositoriesList.attachTo(this.repositories);
    this.repositoryShow.attachTo(this.repositories)
    this.repositories.bind('select', this.repositorySelected);
  },
  recent: function() {
    this.reset();
    this.repositories.whenLoaded(this.repositories.selectFirst); // TODO currently whenLoaded doesn't actually do anything useful
    this.repositoryShow.activateTab('current');
  },
  repository: function(username, name) {
    this.reset();
    this.repositories.whenLoaded(this.repositories.selectBy, { name: username + '/' + name });
    this.repositoryShow.activateTab('current');
  },
  repositoryHistory: function(username, name) {
    this.reset();
    this.repositories.whenLoaded(this.repositories.selectBy, { name: username + '/' + name });
    this.repositoryShow.activateTab('history');
  },
  repositoryBuild: function(username, name, buildId) {
    this.reset();
    this.buildId = parseInt(buildId);
    this.repositories.whenLoaded(this.repositories.selectBy, { name: username + '/' + name });
    this.repositoryShow.activateTab('build');
  },
  reset: function() {
    delete this.buildId;
  },
  repositorySelected: function(repository) {
    if(repository.builds.length == 0) { // TODO collection might be empty. maintain collection.loaded or something
      repository.builds.fetch();
    }
    if(this.buildId) {
      repository.builds.whenLoaded(function() { repository.builds.select(this.buildId) }.bind(this));
    }
  }
});

