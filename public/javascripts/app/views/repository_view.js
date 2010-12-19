var RepositoryView = Backbone.View.extend({
  initialize: function(app) {
    _.bindAll(this, 'render', 'repository_changed', 'build_created', 'build_updated');

    this.template = app.templates['repositories/show'];
    this.element = $('#right');
    this.app = app;
    this.bind();
  },
  bind: function() {
    Backbone.Events.bind.apply(this, arguments);
    this.app.bind('build:created', this.build_created);
    this.app.bind('build:updated', this.build_updated);
    // TODO should bind to the specific repository it's rendering
    this.app.repositories.bind('change', this.repository_changed);
  },
  unbind: function() {
    Backbone.Events.unbind.apply(this, arguments);
    this.app.unbind('build:created', this.build_created);
    this.app.unbind('build:updated', this.build_updated);
    this.app.repositories.unbind('change', this.repository_changed);
  },
  render: function(repository) {
    if(repository) {
      this.element.html($(this.template(repository.attributes)));
    }
  },
  repository_changed: function(repository) {
    this.render(repository);
  },
  build_created: function(data) {
  },
  build_updated: function(data) {
  }
});

