Travis.Controllers.Application = Backbone.Controller.extend({
  routes: {
    '':                                          'recent',
    // '!/:owner':               'byOwner',
    // FIXME: I would suggest to use !/repositories/:owner/:name, to make it more rest-like.
    // Because, for instance, now we should put myRepositories on top so that it could get matched. Unambigous routes rule!
    '!/:owner/:name/L:line_number':              'repository',
    '!/:owner/:name':                            'repository',
    '!/:owner/:name/builds':                     'repositoryHistory',
    '!/:owner/:name/builds/:id/L:line_number':   'repositoryBuild',
    '!/:owner/:name/builds/:id':                 'repositoryBuild',
  },
  initialize: function() {
    _.bindAll(this, 'recent', 'byUser', 'repository', 'repositoryHistory', 'repositoryBuild', 'repositoryShow', 'repositorySelected',
              'buildQueued', 'buildStarted', 'buildLogged', 'buildFinished', 'buildRemoved');
  },

  run: function() {
    this.repositories = new Travis.Collections.Repositories();
    this.builds       = new Travis.Collections.AllBuilds();
    this.jobs         = new Travis.Collections.Jobs([], { queue: 'builds' });
    this.jobsRails    = new Travis.Collections.Jobs([], { queue: 'rails' });
    this.workers      = new Travis.Collections.Workers();

    this.repositoriesList = new Travis.Views.Repositories.List();
    this.repositoryShow   = new Travis.Views.Repository.Show({ parent: this });
    this.workersView      = new Travis.Views.Workers.List();
    this.jobsView         = new Travis.Views.Jobs.List({ queue: 'builds' });
    this.jobsRailsView    = new Travis.Views.Jobs.List({ queue: 'rails' });

    $('#left #tab_recent .tab').append(this.repositoriesList.render().el);
    $('#main').append(this.repositoryShow.render().el);

    this.repositoriesList.attachTo(this.repositories);
    this.repositoryShow.attachTo(this.repositories)
    this.workersView.attachTo(this.workers)
    this.jobsView.attachTo(this.jobs)
    this.jobsRailsView.attachTo(this.jobsRails)
    this.repositories.bind('select', this.repositorySelected);

    this.bind('build:started',    this.buildStarted);
    this.bind('build:finished',   this.buildFinished);
    this.bind('build:configured', this.buildConfigured);
    this.bind('build:log',        this.buildLogged);
    this.bind('build:queued',     this.buildQueued);
    this.bind('build:removed',    this.buildRemoved); /* UNTESTED */

    this.workers.fetch();
    this.jobs.fetch();
    this.jobsRails.fetch();
  },

  // actions

  recent: function() {
    this.reset();
    this.followBuilds = true;
    this.selectTab('current');
    this.repositories.whenFetched(_.bind(function () {
      this.repositories.selectLast();

    }, this));
  },
  repository: function(owner, name, line_number) {
    console.log ("application#repository: ", arguments)
    this.reset();
    this.trackPage();
    this.startLoading();
    window.params = { owner: owner, name: name, line_number: line_number, action: 'repository' }
    this.selectTab('current');
    this.repositories.whenFetched(_.bind(function(repositories) {
      repositories.selectLastBy({ slug: owner + '/' + name });

    }, this));
  },
  repositoryHistory: function(owner, name) {
    console.log ("application#repositoryHistory: ", arguments)
    this.reset();
    this.trackPage();
    this.selectTab('history');
    this.repositories.whenFetched(_.bind(function(repositories) {
      repositories.selectLastBy({ slug: owner + '/' + name })

    }, this));
  },
  repositoryBuild: function(owner, name, buildId, line_number) {
    console.log ("application#repositoryBuild: ", arguments)
    this.reset();
    this.trackPage();
    this.startLoading();
    window.params = { owner: owner, name: name, build_id: buildId, line_number: line_number, action: 'repositoryBuild' }
    this.buildId = parseInt(buildId);
    this.selectTab('build');
    this.repositories.whenFetched(_.bind(function(repositories) {
      repositories.selectLastBy({ slug: owner + '/' + name })

    }, this));
  },

  // helpers
  reset: function() {
    delete this.buildId;
    delete this.tab;
    this.followBuilds = false;
    window.params = {};
  },
  startLoading: function() {
    $('#main').addClass('loading')
  },
  stopLoading: function() {
    $('#main').removeClass('loading')
  },
  trackPage: function() {
    window._gaq = _gaq || [];
    window._gaq.push(['_trackPageview']);
  },


  // internal events
  repositorySelected: function(repository) {
    repository.builds.bind('finish_get_or_fetch', function() { this.stopLoading() }.bind(this))

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
    console.log ("application#buildQueued: ", arguments)
    this.addJob(data);
  },
  buildStarted: function(data) {
    console.log ("application#buildStarted: ", arguments)
    this.removeJob(data);
    this.repositories.update(data);

    if((this.followBuilds || this.tab == 'current' && this.repositories.selected().get('slug') == data.slug) && !this.buildId && !data.build.parent_id) {
      var repository = this.repositories.get(data.id);
      if(!repository.selected) repository.select();
      repository.builds.select(data.build.id);
    }
  },
  buildConfigured: function(data) {
    console.log ("application#buildConfigured: ", arguments)
    this.removeJob(data);
    this.repositories.update(data);
  },
  buildFinished: function(data) {
    console.log ("application#buildFinished: ", arguments)
    this.repositories.update(data);
  },
  buildRemoved: function(data) {
    console.log ("application#buildRemoved: ", arguments)
    this.removeJob(data);
  },
  buildLogged: function(data) {
    console.log ("application#buildLogged: ", arguments)
    this.repositories.update(data);
  },

  selectTab: function(tab) {
    this.tab = tab;
    this.repositoryShow.activateTab(this.tab);
  },
  addJob: function(data) {
    this.jobsCollection(data).add({ number: data.build.number, id: data.build.id, repository: { slug: data.slug } });
  },
  removeJob: function(data) {
    this.jobsCollection(data).remove({ id: data.build.id });
  },
  jobsCollection: function(data) {
    return this.buildingRails(data) ? this.jobsRails : this.jobs;
  },
  buildingRails: function (data) {
    return data.slug && data.slug == 'rails/rails';
  }
});


