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
    _.bindAll(this, 'repositoriesIndex', 'repositoryShow', 'repositoryHistory', 'buildShow', 'render', 'startLoading', 'stopLoading');

    this.templates    = Travis.Helpers.Util.loadTemplates();
    this.repositories = new Travis.Collections.Repositories();
    this.jobs         = new Travis.Collections.Jobs();
    this.workers      = new Travis.Collections.Workers();
    this.views        = [];

    this.repositoriesView = new Travis.Views.Repositories({ templates: this.templates });
    this.repositoryView   = new Travis.Views.Repository({ templates: this.templates, repositories: this.repositories });
    this.workersView      = new Travis.Views.Workers({ templates: this.templates });
    this.jobsView         = new Travis.Views.Jobs({ templates: this.templates });

    this.bind('build:started',  this.repositories.update);
    this.bind('build:log',      this.repositories.update);
    this.bind('build:finished', this.repositories.update);
    this.bind('build:queued',   this.jobs.add);
    this.bind('build:started',  this.jobs.remove);

    this.repositories.bind('repositories:load:start', this.startLoading);
    this.repositories.bind('repositories:load:done',  this.stopLoading);
  },
  repositoriesIndex: function(username) {
    this.render({ username: username });
  },
  repositoryShow: function(username, name) {
    this.render({ username: username, name: name });
  },
  repositoryHistory: function(username, name) {
    this.render({ username: username, name: name, tab: 'History' });
  },
  buildShow: function(username, name, buildId) {
    this.render({ username: username, name: name, tab: 'Build', buildId: buildId });
  },
  render: function(args) {
    this.repositoriesView.connect(this.repositories);
    this.repositories.fetch({ username: args.username, success: function() {
      var repository = args.name ? this.repositories.findByName(args.username + '/' + args.name) : this.repositories.last();
      if(repository) {
        this.repositories.setSelected(repository);
        this.repositoryView.connect(_.extend(args, { repository: repository }));
      }
    }.bind(this) });

    if(!this.workersView.connected()) {
      this.workersView.connect(this.workers);
      this.workers.fetch();
    }
    if(!this.jobsView.connected()) {
      this.jobsView.connect(this.jobs);
      this.jobs.fetch();
    }
  },
  startLoading: function() {
    $('#main').addClass('loading');
  },
  stopLoading: function() {
    $('#main').removeClass('loading');
  }
});
