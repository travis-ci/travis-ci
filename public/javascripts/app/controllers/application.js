Travis.Controllers.Application = Backbone.Controller.extend({
  routes: {
    '':                             'recent',
    // '!/:username':                  'byUser',
    '!/:username/:name':            'repository',
    '!/:username/:name/builds':     'repositoryHistory',
    '!/:username/:name/builds/:id': 'repositoryBuild',
  },
  initialize: function() {
    _.bindAll(this, 'recent', 'byUser', 'repository', 'repositoryHistory', 'repositoryBuild', 'repositoryShow', 'repositorySelected',
      'buildQueued', 'buildStarted', 'buildLogged', 'buildFinished');
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

    this.bind('build:started',  this.buildStarted);
    this.bind('build:finished', this.buildFinished);
    this.bind('build:log',      this.buildLogged);
    this.bind('build:queued',   this.buildQueued);

    this.workers.fetch();
    this.jobs.fetch();
  },

  // actions

  recent: function() {
    this.reset();
    this.tab = 'current';
    this.repositories.whenFetched(this.repositories.selectLast);
    this.selectTab();
    this.followBuilds = true;
  },
  repository: function(username, name) {
    this.reset();
    this.tab = 'current';
    this.repositories.whenFetched(function(repositories) { repositories.selectBy({ name: username + '/' + name }) });
    this.selectTab();
  },
  repositoryHistory: function(username, name) {
    this.reset();
    this.tab = 'history';
    this.repositories.whenFetched(function(repositories) { repositories.selectBy({ name: username + '/' + name }) });
    this.selectTab();
  },
  repositoryBuild: function(username, name, buildId) {
    this.reset();
    this.tab = 'build';
    this.buildId = parseInt(buildId);
    this.repositories.whenFetched(function(repositories) { repositories.selectBy({ name: username + '/' + name }) });
    this.selectTab();
  },
  reset: function() {
    delete this.buildId;
    delete this.tab;
    this.followBuilds = false;
  },
  repositorySelected: function(repository) {
    repository.builds().whenFetched(function(builds) { if(this.buildId) { builds.select(this.buildId); } }.bind(this));
  },

  // external events

  buildQueued: function(data) {
    this.jobs.add({ number: data.build.number, id: data.build.id, repository: { name: data.name } });
  },
  buildStarted: function(data) {
    this.repositories.update(data);
    this.jobs.remove({ id: data.build.id });
    if((this.followBuilds || this.repositories.selected().get('name') == data.name) && !this.buildId) {
      var repository = this.repositories.get(data.id);
      if(!repository.selected) repository.select();
      repository.builds().select(data.build.id);
    }
  },
  buildFinished: function(data) {
    this.repositories.update(data);
  },
  buildLogged: function(data) {
    var repository = this.repositories.get(data.id);
    if(!repository) return;
    var build = repository.builds().get(data.build.id);
    if(!build) return;
    build.appendLog(data.log);
  },
  selectTab: function() {
    this.repositoryShow.activateTab(this.tab);
  },
});

