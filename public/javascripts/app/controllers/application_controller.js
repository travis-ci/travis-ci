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
    this.repositories_list = new RepositoriesListView({ app: this, repositories: this.repositories, templates: this.templates });

    this.bind('build:created', this.repositories.update)
    // this.bind('build:updated', this.repositories.update)
    this.bind('build:finished', this.repositories.update)
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
    this.repositories_list.render();
  },
  render_repository: function() {
    if(this.repository) {
      this.details = new RepositoryView({ app: this, repository: this.repository, templates: this.templates });
      this.details.render();
    }
  },
  render_build: function() {
    if(this.build) {
      this.details = new BuildView({ app: this, build: this.build, templates: this.templates });
      this.details.render();
    }
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

