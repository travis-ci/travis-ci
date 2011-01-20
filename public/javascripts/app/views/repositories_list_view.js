var RepositoriesListView = Backbone.View.extend({
  tagName: 'ul',
  id: 'repositories',
  initialize: function (args) {
    _.bindAll(this, 'bind', 'unbind', 'on_refresh', 'on_add', 'on_update', 'render_repository');

    this.app = args.app;
    this.repositories = args.app.repositories;
    this.template = args.app.templates['repositories/_item'];
    this.element = $('#left #repositories');

    this.repositories.bind('refresh', this.on_refresh);
    this.repositories.bind('add', this.on_add);
    this.repositories.bind('build:add', this.on_update);
    this.repositories.bind('build:change', this.on_update);
  },
  on_refresh: function() {
    this.element.empty();
    _.each(this.repositories.models, this.render_repository);
    this.element.update_times();
  },
  on_add: function(item) {
    var repository = _.isFunction(item.repository) ? item.repository() : item;
    var element = this.render_repository(repository);
    element.update_times();
    // var method = repository.is_building() ? Util.flash : Util.unflash;
    // method.apply(this, [$('#repository_' + repository.get('id')), this.element]);
  },
  on_update: function(item) {
    var repository = _.isFunction(item.repository) ? item.repository() : item;
    $('#repository_' + repository.id, this.element).remove();
    this.on_add(item);
  },
  render_repository: function(repository) {
    return this.element.prepend($(this.template(repository.toJSON())));
  }
});
