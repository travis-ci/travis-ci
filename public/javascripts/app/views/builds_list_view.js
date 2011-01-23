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
    repository.builds.bind('add', this.build_added);
    repository.builds.bind('change', this.build_changed);
    repository.builds.bind('builds:load:start', this.start_loading);
    repository.builds.bind('builds:load:done',  this.stop_loading);
  },
  unbind: function() {
    if(this.repository) {
      this.repository.builds.unbind('add', this.build_added);
      this.repository.builds.unbind('change', this.build_changed);
    }
  },
  render: function(repository) {
    this.bind(repository);
    repository.builds.load(function() {
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
  },
  start_loading: function() {
    $('#tab_history div').addClass('loading');
  },
  stop_loading: function() {
    $('#tab_history div').removeClass('loading');
  }
});


