var RepositoriesListView = Backbone.View.extend({
  tagName: 'ul',
  id: 'repositories',
  initialize: function (args) {
    _.bindAll(this, 'render', 'repository_added', 'repository_updated', 'build_log', 'update_flash');

    this.app = args.app;
    this.repositories = args.repositories;
    this.template = args.templates['repositories/_item'];
    this.element = $('#repositories');

    this.app.bind('build:log', this.build_log);
    this.repositories.bind('add', this.repository_added);
    this.repositories.bind('change', this.repository_updated)
  },
  render: function() {
    this.element.empty();
    var view = this;
    this.repositories.each(function(item) { view.element.append($(view.template(item.toJSON()))); });
    return this;
  },
  repository_added: function (repository) {
    this.element.prepend($(this.template(repository.toJSON())));
    this.update_flash(repository);
    Util.update_times();
  },
  repository_updated: function(repository) {
    $('#repository_' + repository.get('id'), this.element).remove();
    this.repository_added(repository);
  },
  build_log: function(data) {
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
