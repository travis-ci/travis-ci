var ApplicationController = Backbone.Controller.extend({
  templates: {},
  routes: {
    '':                              'repositories_index',
    '!/repositories/:id':            'repositories_show',
    '!/repositories/:id/builds/:id': 'builds_show'
  },
  run: function() {
    _.bindAll(this, 'render', 'render_repositories', 'render_repository', 'render_build');

    this.initialize_templates();
    this.repositories = new Repositories(INIT_DATA.repositories);
    this.builds = new Builds;
    this.repositories_list = new RepositoriesListView({ app: this, repositories: this.repositories, templates: this.templates });

    this.bind('build:started', this.repositories.update)
    this.bind('build:finished', this.repositories.update)
  },
  repositories_index: function() {
    this.params = {}
    this.render(this.render_repository);
  },
  repositories_show: function(repository_id) {
    this.params = { repository_id: parseInt(repository_id) }
    this.render(this.render_repository);
  },
  builds_show: function(repository_id, build_id) {
    this.params = { repository_id: parseInt(repository_id), build_id: parseInt(build_id) }
    this.builds.retrieve(build_id, function(build) {
      this.build = build;
      this.render(this.render_build);
    }.bind(this));
  },
  render: function(content) {
    this.render_repositories();
    content.apply(this);
    this.update_times();
  },
  render_repositories: function() {
    this.repositories_list.render();
  },
  render_repository: function() {
    if(this.repository()) {
      this.details = new RepositoryView({ app: this, repository: this.repository(), templates: this.templates });
      this.details.render();
    }
  },
  render_build: function() {
    if(this.build) {
      this.details = new BuildView({ app: this, build: this.build, templates: this.templates });
      this.details.render();
    }
  },
  reset: function() {
    this._repository = null;
    if(this.details != undefined) {
      this.details.unbind(this);
      delete this.details;
    }
  },
  repository: function() {
    if(!this._repository) {
      this._repository = this.params.repository_id ?  this.repositories.find(this.params.repository_id) : this.repositories.last();
    }
    return this._repository;
  },
  update_times: function() {
    $('.timeago').timeago();
    $('.finished_at[title=""]').prev('.finished_at_label').hide();
    $('.finished_at[title=""]').next('.eta_label').show().next('.eta').show();
  },
  initialize_templates: function() {
    var app = this;
    $('div[type=text/x-js-template]').map(function() {
      var name = $(this).attr('name');
      var source = $(this).html().replace('&gt;', '>');

      if(name.split('/')[1][0] == '_') {
        Handlebars.registerPartial(name, source)
      }
      app.templates[name] = Handlebars.compile(source);
    });
  }
});

