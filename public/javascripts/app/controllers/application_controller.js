var ApplicationController = Backbone.Controller.extend({
  templates: {},
  routes: {
    '':                                        'repositories_index',
    '!/:username':                             'repository_index',
    '!/:username/:repository_name':            'repository_show',
    '!/:username/:repository_name/builds':     'repository_history',
    '!/:username/:repository_name/builds/:id': 'build_show',
    // '!/:username':                             'repositories_index',
  },
  run: function() {
    _.bindAll(this, 'repositories_index', 'repository_show', 'repository_history', 'build_show', 'render', 'render_repositories', 'render_repository', 'render_build');

    this.templates    = Util.initialize_templates();
    this.repositories = new Repositories(INIT_DATA.repositories, { application: this });
    this.jobs         = new Jobs(INIT_DATA.jobs);
    this.workers      = new Workers(INIT_DATA.workers);

    this.repositories_list_view  = new RepositoriesListView({ app: this, repositories: this.repositories, templates: this.templates });
    this.repository_view         = new RepositoryView({ app: this, templates: this.templates });
    this.no_repository_view      = new NoRepositoryView({ app: this, templates: this.templates });
    this.build_view              = new BuildView({ app: this, templates: this.templates });
    this.workers_list_view       = new WorkersListView({ app: this, templates: this.templates, workers: this.workers });
    this.jobs_list_view          = new JobsListView({ app: this, templates: this.templates, jobs: this.jobs });

    this.bind('build:started',  this.repositories.update);
    this.bind('build:log',      this.repositories.update);
    this.bind('build:finished', this.repositories.update);
    this.bind('build:queued',   this.jobs.add);
    this.bind('build:started',  this.jobs.remove);
  },
  repositories_index: function(username) {
    var repository = this.repositories.last(); // TODO ... by username
    this.render(repository, function() { this.repository_view.render(repository); });
  },
  repository_show: function(username, repository_name, tab) {
    var name = username + '/' + repository_name;
    var repository = this.repositories.find_by_name(name);
    if(repository) {
      this.render(repository, function() { this.repository_view.render(repository, tab); });
    } else {
      this.render(function() { this.no_repository_view.render(name) })
    }
  },
  repository_history: function(username, repository_name) {
    this.repository_show(username, repository_name, 'history')
  },
  build_show: function(username, repository_name, build_id) {
    var repository = this.repositories.find_by_name(username + '/' + repository_name);
    repository.builds.retrieve(build_id, function(build) {
      this.render(build, function(build) { this.build_view.render(build); });
    }.bind(this));
  },
  render: function() {
    this.repositories_list_view.unbind(this);
    this.repository_view.unbind(this);
    this.build_view.unbind(this);
    this.workers_list_view.unbind();
    this.jobs_list_view.unbind();

    this.workers_list_view.render();
    this.jobs_list_view.render();
    this.repositories_list_view.render();

    arguments[arguments.length - 1].apply(this, Array.prototype.slice.call(arguments, 0, -1));
    Util.update_times();
  },
});
