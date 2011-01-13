var RepositoriesListView = Backbone.View.extend({
  tagName: 'ul',
  id: 'repositories',
  initialize: function (args) {
    _.bindAll(this, 'bind', 'render', 'render_item', 'repository_added', 'build_added', 'build_changed', 'build_log', 'update_item');

    this.app = args.app;
    this.repositories = args.repositories;
    this.list_template = args.templates['repositories/list'];
    this.item_template = args.templates['repositories/_item'];
    this.element = $('#left');

    this.repositories.bind('add', this.repository_added);
  },
  bind: function(builds) {
    builds.bind('add', this.build_added, 'foo');
    builds.last().bind('change', this.build_changed);
  },
  render: function() {
    this.element.empty();
    var view = this;
    this.element.html(this.list_template(this.repositories.toJSON().reverse()))
    _.each(this.repositories.models, function(repository) { this.bind(repository.builds) }.bind(this));
  },
  render_item: function(repository) {
    $('#repository_' + repository.id, this.element).remove();
    $('#repositories', this.element).prepend($(this.item_template(repository.toJSON())));
  },
  repository_added: function (repository) {
    this.bind(repository.builds);
    this.render_item(repository);
    this.update_item(repository);
  },
  build_added: function(build) {
    var repository = build.repository();
    this.bind(repository.builds);
    this.render_item(repository);
    this.update_item(repository);
  },
  build_changed: function(build) {
    var repository = build.repository();
    this.render_item(repository);
    this.update_item(repository);
  },
  update_item: function(repository) {
    var method = repository.is_building() ? Util.flash : Util.unflash;
    method.apply(this, [$('#repository_' + repository.get('id')), this.element]);
    Util.update_times();
  },
});
