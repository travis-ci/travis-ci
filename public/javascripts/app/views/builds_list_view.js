var BuildsListView = Backbone.View.extend({
  initialize: function(args) {
    _.bindAll(this, 'bind', 'unbind', 'render', 'build_added', 'build_changed');

    this.app = args.app;

    this.template = args.app.templates['builds/list'];
    this.item_template = args.app.templates['builds/_item']
  },
  element: function() {
    return $('#tab_history div');
  },
  bind: function(repository) {
    this.repository = repository;
    this.repository.builds.bind('add', this.build_added);
    this.repository.builds.bind('change', this.build_changed);
  },
  unbind: function() {
    if(this.repository) {
      this.repository.builds.unbind('add', this.build_added);
      this.repository.builds.unbind('change', this.build_changed);
    }
  },
  render: function(repository) {
    repository.builds.load(function() {
      this.bind(repository);
      var element = this.element();
      element.html($(this.template({ repository: repository.toJSON(), builds: repository.builds.toJSON().reverse() })));
      Util.update_times(element);
    }.bind(this));
  },
  build_added: function(build) {
    $('tr:first-child', this.element()).after($(this.item_template(build.toJSON())));
  },
  build_changed: function(build) {
    $('tr#builds_' + build.id, this.element()).html($(this.item_template(build.toJSON())));
  }
});


