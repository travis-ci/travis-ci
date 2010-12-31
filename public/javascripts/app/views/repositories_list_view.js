var RepositoriesListView = Backbone.View.extend({
  tagName: 'ul',
  id: 'repositories',
  initialize: function (args) {
    _.bindAll(this, 'render', 'render_item', 'repository_added', 'build_added', 'build_changed', 'build_log', 'update_item');

    this.app = args.app;
    this.repositories = args.repositories;
    this.template = args.templates['repositories/_item'];
    this.element = $('#repositories');

    this.repositories.bind('add', this.repository_added);
  },
  render: function() {
    this.element.empty();
    var view = this;
    this.repositories.each(this.render_item);
    return this;
  },
  render_item: function(repository) {
    repository.builds.bind('add', this.build_added, 'foo');
    repository.builds.last().bind('change', this.build_changed);
    $('#repository_' + repository.id, this.element).remove();
    this.element.prepend($(this.template(repository.toJSON())));
  },
  repository_added: function (repository) {
    this.render_item(repository);
    this.update_item(repository);
  },
  build_added: function(build) {
    var repository = build.repository();
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
