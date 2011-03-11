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
    _.bindAll(this, 'recent', 'byUser', 'repository', 'repositoryHistory', 'repositoryBuild', 'repositoryShow', 'reset', 'repositorySelected', 'log');
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
    this.workersView.attachTo(this.workers)
    this.jobsView.attachTo(this.jobs)
    this.repositories.bind('select', this.repositorySelected);

    this.bind('build:started',  this.repositories.update);
    this.bind('build:finished', this.repositories.update);
    this.bind('build:log',      this.log);
    this.bind('build:queued',   function(data) { this.jobs.add({ name: data.name, number: data.last_build.number, id: data.last_build.id }) }.bind(this));
    this.bind('build:started',  function(data) { this.jobs.remove({ id: data.last_build.id }) }.bind(this));
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
      repository.builds.fetch({ success: function() {
        if(this.buildId) {
          repository.builds.whenLoaded(function() { repository.builds.select(this.buildId) }.bind(this));
        }
      }.bind(this)});
    } else {
      if(this.buildId) {
        repository.builds.whenLoaded(function() { repository.builds.select(this.buildId) }.bind(this));
      }
    }
  },
  log: function(data) {
    var repository = this.repositories.get(data.id);
    if(!repository) return;
    var build = repository.builds.get(data.last_build.id);
    if(!build) return;
    build.appendLog(data.log);
  }
});

