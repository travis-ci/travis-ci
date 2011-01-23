var RepositoriesListView = Backbone.View.extend({
  tagName: 'ul',
  id: 'repositories',
  initialize: function (args) {
    _.bindAll(this, 'bind', 'unbind', 'repositories_updated', 'repository_added', 'build_updated', 'build_started', 'build_stopped', 'render_repository', 'update_status');

    this.app = args.app;
    this.repositories = args.app.repositories;
    this.template = args.app.templates['repositories/_item'];
    this.element = $('#left #repositories');

    this.repositories.bind('refresh', this.repositories_updated);
    this.repositories.bind('add', this.repository_added);
    this.repositories.bind('build:add', this.build_updated);
    this.repositories.bind('build:change', this.build_updated);

    setTimeout(500, this.update_status)
  },
  repositories_updated: function() {
    this.element.empty();
    _.each(this.repositories.models, this.render_repository);
    this.element.update_times();
    this.update_status();
  },
  repository_added: function(item) {
    var repository = _.isFunction(item.repository) ? item.repository() : item;
    var element = this.render_repository(repository);
    element.update_times();
  },
  build_updated: function(item) {
    var repository = _.isFunction(item.repository) ? item.repository() : item;
    $('#repository_' + repository.id, this.element).remove();
    var element = this.render_repository(repository);
    element.update_times();
  },
  render_repository: function(repository) {
    return this.element.prepend($(this.template(repository.toJSON())));
  },
  set_current: function(repository) {
    $('.repository', this.element).removeClass('current');
    $('#repository_' + repository.id, this.element).addClass('current');
  },
  update_status: function() {
    this.element.removeClass('active');
    _.each(this.repositories.models, function(repository) {
      if(repository.is_building()) $('#repository_' + repository.id, this.element).addClass('active');
    });
  }
});
