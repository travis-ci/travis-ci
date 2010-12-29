var ApplicationController = Backbone.Controller.extend({
  templates: {},
  routes: {
    '':                              'repositories_index',
    '!/repositories/:id':            'repository_show',
    '!/repositories/:id/builds/:id': 'build_show'
  },
  run: function() {
    _.bindAll(this, 'render', 'render_repositories', 'render_repository', 'render_build');

    this.initialize_templates();
    this.repositories = new Repositories(INIT_DATA.repositories);
    this.builds = new Builds;

    this.repositories_list = new RepositoriesListView({ app: this, repositories: this.repositories, templates: this.templates });
    this.repository_view   = new RepositoryView({ app: this, templates: this.templates });
    this.build_view        = new BuildView({ app: this, templates: this.templates });

    this.bind('build:started', this.repositories.update)
    this.bind('build:finished', this.repositories.update)
  },
  repositories_index: function() {
    this.render(this.render_repository, this.repositories.last());
  },
  repository_show: function(repository_id) {
    this.render(this.render_repository, this.repositories.find(parseInt(repository_id)));
  },
  build_show: function(repository_id, build_id) {
    this.builds.retrieve(build_id, function(build) {
      build.repository = this.repositories.find(build.get('repository').id);
      this.render(this.render_build, build);
    }.bind(this));
  },
  render: function(content) {
    this.repositories_list.unbind(this);
    this.repository_view.unbind(this);
    this.build_view.unbind(this);

    this.render_repositories();
    content.apply(this, Array.prototype.slice.call(arguments, 1));
    Util.update_times();
  },
  render_repositories: function() {
    this.repositories_list.render();
  },
  render_repository: function(repository) {
    if(!repository) return
    this.repository_view.render(repository);
  },
  render_build: function(build) {
    if(!build) return
    this.build_view.render(build);
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

