var RepositoriesListView = Backbone.View.extend({
  tagName: 'ul',
  id: 'repositories',
  initialize: function (args) {
    _.bindAll(this, 'repository_selected', 'repository_updated', 'build_created', 'build_updated', 'build_finished', 'render');

    this.app = args.app;
    this.repositories = args.repositories;
    this.template = args.templates['repositories/_item'];
    this.element = $('#repositories');

    this.app.bind('repository:selected', this.repository_selected);
    this.app.bind('build:created', this.build_created);
    this.app.bind('build:updated', this.build_updated);
    this.app.bind('build:finished', this.build_finished);

    this.repositories.bind('add', this.repository_added);
    this.repositories.bind('change', this.repository_updated)
  },
  render: function() {
    this.element.empty();
    var view = this;
    this.repositories.each(function(item) { view.element.prepend($(view.template(item.attributes))); });
    return this;
  },
  repository_selected: function(repository_id) {
    $('.repository', this.element).removeClass('active');
    $('#repository_' + repository_id, this.element).addClass('active');
  },
  repository_updated: function(repository) {
    var element = $('#repository_' + repository.get('id'), this.element);
    element.html($(this.template(repository.attributes)).html());
    element.removeClass('red green').addClass(repository.attributes.last_build.color);
  },
  build_created: function(data) {
    Util.flash($('#repository_' + data.repository.id), this.element);
  },
  build_updated: function(data) {
    Util.flash($('#repository_' + data.repository.id), this.element);
  },
  build_finished: function(data) {
    Util.unflash($('#repository_' + data.repository.id), this.element);
  }
});
