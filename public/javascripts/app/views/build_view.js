var BuildView = Backbone.View.extend({
  initialize: function(args) {
    _.bindAll(this, 'bind', 'unbind', 'render', 'build_changed', 'build_logged');

    this.app = args.app;
    this.show_template = args.templates['builds/show'];
    this.summary_template = args.templates['builds/_summary'];
    this.element = $('#main');
  },
  bind: function() {
    Backbone.Events.bind.apply(this, arguments);
    this.build.bind('change', this.build_changed);
    this.build.bind('log', this.build_logged);
  },
  unbind: function() {
    Backbone.Events.unbind.apply(this, arguments);
    if(this.build) {
      this.build.unbind('changed', this.build_changed);
      this.build.unbind('log', this.append_log);
    }
  },
  render: function(build) {
    this.build = build;
    this.bind();
    this.element.html($(this.show_template(this.build.toJSON())));
    $('.log', this.element).deansi();
    Util.activate_tab(this.element, 'log');
  },
  build_changed: function(build) {
    $('#build_' + build.id + ' .summary', this.element).replaceWith($(this.summary_template(build.toJSON())));
    Util.update_times();
  },
  build_logged: function(build, chars) {
    var element = $('#build_' + build.id + ' .log', this.element);
    element.append(chars);
    element.deansi();
  }
});

