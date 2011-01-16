var BuildsListView = Backbone.View.extend({
  initialize: function(args) {
    _.bindAll(this, 'bind', 'unbind', 'render', 'build_added', 'build_changed');

    this.app = args.app;
    this.template = args.templates['builds/list'];
    this.item_template = args.templates['builds/_item']
  },
  bind: function() {
    if(this.repository) {
      this.repository.builds.bind('add', this.build_added);
      this.repository.builds.bind('change', this.build_changed);
    }
  },
  unbind: function() {
    if(this.repository) {
      this.repository.builds.unbind('add', this.build_added);
      this.repository.builds.unbind('change', this.build_changed);
    }
  },
  render: function(repository, element) {
    this.repository = repository;
    this.element = element;
    this.bind();

    repository.builds.load(function() {
      this.bind();
      element.html($(this.template({ repository: repository.toJSON(), builds: repository.builds.toJSON().reverse() })));
      Util.update_times(element);
    }.bind(this));
  },
  build_added: function(build) {
    // hmm, repository_view already re-renders the tab on build_added
  },
  build_changed: function(build) {
    $('tr#builds_' + build.id, this.element).html($(this.item_template(build.toJSON())));
  }
});


