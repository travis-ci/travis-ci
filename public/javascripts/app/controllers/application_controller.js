var ApplicationController = Backbone.Controller.extend({
  templates: {},
  routes: {
    '':                   'repositories_index',
    '!/repositories/:id': 'repositories_show',
    '!/builds/:id':       'builds_show'
  },
  run: function() {
    _.bindAll(this, 'render', 'render_repositories', 'render_repository', 'render_build');

    this.initialize_templates();
    this.repositories = new Repositories(INIT_DATA.repositories);
    this.builds = new Builds;

    this.repositories_list = new RepositoriesListView(this);
    // this.repository_view = new RepositoryView(this);
    // this.build_view = new BuildView(this);

    this.bind('build:created', this.repositories.update_build)
    this.bind('build:updated', this.repositories.update_build)
    this.bind('build:finished', this.repositories.update_build)
  },
  repositories_index: function() {
    this.repository = this.repositories[this.repositories.length - 1];
    this.render(this.render_repository);
  },
  repositories_show: function(id) {
    this.repository = this.repositories.detect(function(item) { return item.get('id') == parseInt(id) });
    this.render(this.render_repository);
  },
  builds_show: function(id) {
    this.build = new Build({ id: id });
    this.builds.add(this.build);
    this.build.fetch({ success: function(build) { this.render(this.render_build); }.bind(this)});
  },
  render: function(content) {
    if(this.details != undefined) {
      this.details.unbind(this);
      delete this.details;
    }
    this.render_repositories();
    content.apply(this)
  },
  render_repositories: function() {
    this.repositories_list.render(this.repositories);
  },
  render_repository: function() {
    this.details = new RepositoryView(this);
    this.details.render(this.repository);
  },
  render_build: function() {
    this.details = new BuildView(this);
    this.details.render(this.build);
  },
  initialize_templates: function() {
    var app = this;
    $('div[type=text/x-js-template]').map(function() {
      app.templates[$(this).attr('name')] = Handlebars.compile($(this).html());
    });
  }
});

