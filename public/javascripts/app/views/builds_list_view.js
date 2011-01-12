var BuildsListView = Backbone.View.extend({
  initialize: function(args) {
    _.bindAll(this, 'bind', 'unbind', 'render');

    this.app = args.app;
    this.template = args.templates['builds/list'];
  },
  bind: function() {
  },
  unbind: function() {
  },
  render: function(repository, element) {
    this.repository = repository;
    this.element = element;

    repository.builds.load(function() {
      this.bind();
      element.html($(this.template({ repository_id: repository.id, builds: repository.builds.toJSON().reverse() })));
      Util.update_times(element);
    }.bind(this));
  },
});


