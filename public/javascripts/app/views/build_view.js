var BuildView = Backbone.View.extend({
  initialize: function(args) {
    _.bindAll(this, 'bind', 'unbind', 'element', 'render', 'build_changed', 'build_logged');

    this.app = args.app;
    this.show_template = args.app.templates['builds/show'];
    this.summary_template = args.app.templates['builds/_summary'];
  },
  element: function() {
    return $('#tab_build div');
  },
  bind: function(build) {
    this.build = build;
    build.bind('change', this.build_changed);
    build.bind('log', this.build_logged);
    // Backbone.Events.bind.apply(this, arguments);
  },
  unbind: function() {
    if(this.build) {
      this.build.unbind('changed', this.build_changed);
      this.build.unbind('log', this.append_log);
    }
    // Backbone.Events.unbind.apply(this, arguments);
  },
  render: function(build) {
    this.bind(build);

    var element = this.element();
    element.html($(this.show_template(build.toJSON())));

    $('.log', element).deansi();
    Util.activate_tab(element, 'log');
    Util.update_times(element);
  },
  build_changed: function(build) {
    $('.summary', this.element()).replaceWith($(this.summary_template(build.toJSON())));
    Util.update_times();
  },
  build_logged: function(build, chars) {
    var element = $('#build_' + build.id + ' .log', this.element());
    element.append(chars);
    element.deansi();
  }
});

var CurrentBuildView = BuildView.extend({
  initialize: function(args) {
    BuildView.prototype.initialize.apply(this, arguments);
  },
  element: function() {
    return $('#tab_current div');
  },
  bind: function(build) {
    build.collection.bind('add', this.render);
    BuildView.prototype.bind.apply(this, arguments);
  },
});
