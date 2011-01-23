var ApplicationController = Backbone.Controller.extend({
  templates: {},
  routes: {
    '':                             'repositories_index',
    '!/:username':                  'repositories_index',
    '!/:username/:name':            'repository_show',
    '!/:username/:name/builds':     'repository_history',
    '!/:username/:name/builds/:id': 'build_show',
  },
  run: function() {
    _.bindAll(this, 'repositories_index', 'repository_show', 'repository_history', 'build_show', 'render', 'render_repository', 'start_loading', 'stop_loading');

    this.templates    = Util.initialize_templates();
    this.repositories = new Repositories();
    this.jobs         = new Jobs();
    this.workers      = new Workers();
    this.views        = [];

    this.repositories_list_view = new RepositoriesListView({ app: this });
    this.repository_view        = new RepositoryView({ app: this });
    this.workers_list_view      = new WorkersListView({ app: this });
    this.jobs_list_view         = new JobsListView({ app: this });

    this.bind('build:started',  this.repositories.update);
    this.bind('build:log',      this.repositories.update);
    this.bind('build:finished', this.repositories.update);
    this.bind('build:queued',   this.jobs.add);
    this.bind('build:started',  this.jobs.remove);

    this.repositories.bind('repositories:load:start', this.start_loading);
    this.repositories.bind('repositories:load:done',  this.stop_loading);
  },
  unbind: function() {
    this.repository_view.unbind();
    this.workers_list_view.unbind();
    this.jobs_list_view.unbind();
  },
  repositories_index: function(username) {
    this.params = { username: username }
    this.render();
  },
  repository_show: function(username, name) {
    this.params = { username: username, name: name }
    this.render();
  },
  repository_history: function(username, name) {
    this.params = { username: username, name: name, tab: 'history' }
    this.render();
  },
  build_show: function(username, name, build_id) {
    this.params = { username: username, name: name, tab: 'build', build_id: build_id }
    this.render();
  },
  render: function() {
    this.unbind();
    this.repositories.fetch({ username: this.params.username, success: this.render_repository });
    this.repositories_list_view.render();
    this.workers_list_view.render();
    this.jobs_list_view.render();
  },
  render_repository: function() {
    var repository = this.params.name ? this.repositories.find_by_name(this.params.username + '/' + this.params.name) : this.repositories.last();
    this.repositories_list_view.set_current(repository);
    this.repository_view.render(repository, this.params.build_id, this.params.tab || 'current');
  },
  start_loading: function() {
    $('#main').addClass('loading');
  },
  stop_loading: function() {
    $('#main').removeClass('loading');
  }
});
