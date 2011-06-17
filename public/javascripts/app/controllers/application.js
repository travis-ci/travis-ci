Travis.Controllers.Application = Backbone.Controller.extend({
  routes: {
    '':                          'recent',
    // '!/:owner':               'byOwner',
    '!/repositories/my':         'myRepositories',
    // FIXME: I would suggest to use !/repositories/:owner/:name, to make it more rest-like.
    // Because, for instance, now we should put myRepositories on top so that it could get matched. Unambigous routes rule!
    '!/:owner/:name':            'repository',
    '!/:owner/:name/builds':     'repositoryHistory',
    '!/:owner/:name/builds/:id': 'repositoryBuild',
  },
  initialize: function() {
    _.bindAll(this, 'recent', 'byUser', 'repository', 'repositoryHistory', 'repositoryBuild', 'repositoryShow', 'repositorySelected',
              'buildQueued', 'buildStarted', 'buildLogged', 'buildFinished', 'myRepositories' );
  },
  run: function() {
    this.repositories = new Travis.Collections.Repositories();
    this.builds       = new Travis.Collections.AllBuilds();
    this.jobs         = new Travis.Collections.Jobs();
    this.workers      = new Travis.Collections.Workers();

    this.repositoriesList = new Travis.Views.Repositories.List();
    this.repositoryShow   = new Travis.Views.Repository.Show();
    this.workersView      = new Travis.Views.Workers.List();
    this.jobsView         = new Travis.Views.Jobs.List();

    $('#left #tab_recent .tab').append(this.repositoriesList.render().el);
    $('#main').append(this.repositoryShow.render().el);

    this.repositoriesList.attachTo(this.repositories);
    this.repositoryShow.attachTo(this.repositories)
    this.workersView.attachTo(this.workers)
    this.jobsView.attachTo(this.jobs)
    this.repositories.bind('select', this.repositorySelected);

    this.bind('build:started',    this.buildStarted);
    this.bind('build:finished',   this.buildFinished);
    this.bind('build:configured', this.buildConfigured);
    this.bind('build:log',        this.buildLogged);
    this.bind('build:queued',     this.buildQueued);

    this.workers.fetch();
    this.jobs.fetch();
  },

  // actions

  recent: function() {
    this.reset();
    this.tab = 'current';
    this.followBuilds = true;
    this.repositories.whenFetched(this.repositories.selectLast);
    this.selectTab();
  },
  repository: function(owner, name) {
    this.reset();
    this.tab = 'current';
    this.repositories.whenFetched(function(repositories) { repositories.selectLastBy({ slug: owner + '/' + name }) });
    this.selectTab();
  },
  repositoryHistory: function(owner, name) {
    this.reset();
    this.tab = 'history';
    this.repositories.whenFetched(function(repositories) { repositories.selectLastBy({ slug: owner + '/' + name }) });
    this.selectTab();
  },
  myRepositories: function() {
    this.reset();
    var collection = new Travis.Collections.MyRepositories()
    var view = new Travis.Views.Repositories.MyList($('#main'), collection)
  },
  repositoryBuild: function(owner, name, buildId) {
    this.reset();
    this.tab = 'build';
    this.buildId = parseInt(buildId);
    this.repositories.whenFetched(function(repositories) { repositories.selectLastBy({ slug: owner + '/' + name }) });
    this.selectTab();
  },

  // helpers

  reset: function() {
    delete this.buildId;
    delete this.tab;
    this.followBuilds = false;
  },

  // internal events

  repositorySelected: function(repository) {
    switch(this.tab) {
      case 'current':
        repository.builds.select(repository.get('last_build_id'));
        break;
      case 'build':
        repository.builds.select(this.buildId);
        break;
      case 'history':
        if(!repository.builds.fetched) repository.builds.fetch();
        break;
    };
  },

  // external events

  buildQueued: function(data) {
    this.jobs.add({ number: data.build.number, id: data.build.id, repository: { slug: data.slug } });
  },
  buildStarted: function(data) {
    this.repositories.update(data);
    this.jobs.remove({ id: data.build.matrix ? data.build.matrix[0].id : data.build.id });
    if((this.followBuilds || this.tab == 'current' && this.repositories.selected().get('slug') == data.slug) && !this.buildId && !data.build.parent_id) {
      var repository = this.repositories.get(data.id);
      if(!repository.selected) repository.select();
      repository.builds.select(data.build.id);
    }
  },
  buildConfigured: function(data) {
    console.log(data)
    this.jobs.remove({ id: data.build.id });
    this.repositories.update(data);
  },
  buildFinished: function(data) {
    this.repositories.update(data);
  },
  buildLogged: function(data) {
    this.repositories.update(data);
  },
  selectTab: function() {
    this.repositoryShow.activateTab(this.tab);
  },
});

