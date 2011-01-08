var BuildsListView = Backbone.View.extend({
  initialize: function(args) {
    _.bindAll(this, 'bind', 'unbind', 'render');

    this.app = args.app;
    this.template = args.templates['builds/list'];
  },
  bind: function() {
    // Backbone.Events.bind.apply(this, arguments);
    // this.build.bind('change', this.build_changed);
    // this.build.bind('log', this.build_logged);
  },
  unbind: function() {
    // Backbone.Events.unbind.apply(this, arguments);
    // if(this.build) {
    //   this.build.unbind('changed', this.build_changed);
    //   this.build.unbind('log', this.append_log);
    // }
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
  // build_changed: function(build) {
  //   $('#build_' + build.id + ' .summary', this.element).replaceWith($(this.summary_template(build.toJSON())));
  //   Util.update_times();
  // },
  // build_logged: function(build, chars) {
  //   var element = $('#build_' + build.id + ' .log', this.element);
  //   element.append(chars);
  //   element.deansi();
  // }
});


