Travis.Controllers.Application = Backbone.Controller.extend({
  templates: {},
  routes: {
    '':                             'repositoriesIndex',
    '!/:username':                  'repositoriesIndex',
    '!/:username/:name':            'repositoryShow',
    '!/:username/:name/builds':     'repositoryHistory',
    '!/:username/:name/builds/:id': 'buildShow',
  },
  run: function() {
    _.bindAll(this, 'repositoriesIndex', 'repositoryShow', 'repositoryHistory', 'buildShow', 'render', 'renderRepository', 'startLoading', 'stopLoading');

    this.templates    = Travis.Helpers.Util.loadTemplates();
    this.repositories = new Travis.Collections.Repositories();
    this.jobs         = new Travis.Collections.Jobs();
    this.workers      = new Travis.Collections.Workers();
    this.views        = [];

    this.repositoriesView = new Travis.Views.Repositories({ app: this });
    this.repositoryView   = new Travis.Views.Repository({ app: this });
    this.workersView      = new Travis.Views.Workers({ app: this });
    this.jobsView         = new Travis.Views.Jobs({ app: this });

    this.bind('build:started',  this.repositories.update);
    this.bind('build:log',      this.repositories.update);
    this.bind('build:finished', this.repositories.update);
    this.bind('build:queued',   this.jobs.add);
    this.bind('build:started',  this.jobs.remove);

    this.repositories.bind('repositories:load:start', this.startLoading);
    this.repositories.bind('repositories:load:done',  this.stopLoading);
  },
  unbind: function() {
    this.repositoryView.unbind();
    this.workersView.unbind();
    this.jobsView.unbind();
  },
  repositoriesIndex: function(username) {
    this.params = { username: username }
    this.render();
  },
  repositoryShow: function(username, name) {
    this.params = { username: username, name: name }
    this.render();
  },
  repositoryHistory: function(username, name) {
    this.params = { username: username, name: name, tab: 'History' }
    this.render();
  },
  buildShow: function(username, name, buildId) {
    this.params = { username: username, name: name, tab: 'Build', buildId: buildId }
    this.render();
  },
  render: function() {
    this.unbind();
    this.repositories.fetch({ username: this.params.username, success: this.renderRepository });
    this.repositoriesView.render();
    this.workersView.render();
    this.jobsView.render();
  },
  renderRepository: function() {
    var repository = this.params.name ? this.repositories.findByName(this.params.username + '/' + this.params.name) : this.repositories.last();
    if(repository) {
      this.repositoriesView.setCurrent(repository);
      this.repositoryView.render(repository, this.params.buildId, this.params.tab || 'Current');
    }
  },
  startLoading: function() {
    $('#main').addClass('loading');
  },
  stopLoading: function() {
    $('#main').removeClass('loading');
  }
});
