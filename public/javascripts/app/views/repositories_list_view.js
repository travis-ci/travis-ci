var RepositoriesListView = Backbone.View.extend({
  tagName: 'ul',
  id: 'repositories',
  initialize: function (args) {
    _.bindAll(this, 'render', 'repository_added', 'repository_updated', 'build_updated', 'update_flash');

    this.app = args.app;
    this.repositories = args.repositories;
    this.template = args.templates['repositories/_item'];
    this.element = $('#repositories');

    this.app.bind('build:updated', this.build_updated);
    this.repositories.bind('add', this.repository_added);
    this.repositories.bind('change', this.repository_updated)
  },
  render: function() {
    this.element.empty();
    var view = this;
    this.repositories.each(function(item) { view.element.prepend($(view.template(item.attributes))); });
    return this;
  },
  repository_added: function (repository) {
    this.element.prepend($(this.template(repository.attributes)));
    this.update_flash(repository);
  },
  repository_updated: function(repository) {
    var element = $('#repository_' + repository.get('id'), this.element);
    element.replaceWith(this.template(repository.attributes));
    this.update_flash(repository);
  },
  build_updated: function(data) {
    var repository = this.repositories.get(data.id);
    if(repository) {
      this.update_flash(repository);
    }
  },
  update_flash: function(repository) {
    var method = repository.is_building() ? Util.flash : Util.unflash;
    method.apply(this, [$('#repository_' + repository.get('id')), this.element]);
  },
});
