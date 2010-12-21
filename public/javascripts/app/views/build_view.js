var BuildView = Backbone.View.extend({
  initialize: function(args) {
    _.bindAll(this, 'bind', 'unbind', 'render', 'build_updated', 'build_finished', 'update_summary', 'append_log');

    this.app = args.app;
    this.build = args.build;
    this.template = args.templates['builds/show'];
    this.element = $('#right');

    this.bind();
  },
  bind: function() {
    Backbone.Events.bind.apply(this, arguments);
    this.app.bind('build:updated', this.build_updated);
    this.app.bind('build:finished', this.build_finished);
  },
  unbind: function() {
    Backbone.Events.unbind.apply(this, arguments);
    this.app.unbind('build:updated', this.build_updated);
    this.app.unbind('build:finished', this.build_finished);
  },
  render: function() {
    this.element.html($(this.template(this.build.attributes)));
  },
  build_updated: function(data) {
    this.append_log(data)
  },
  build_finished: function(data) {
    this.update_summary(data);
  },
  update_summary: function(data) {
    $('#build_' + data.id + ' .summary', this.element).replaceWith($(this.template(data.repository.last_build)));
  },
  append_log: function(data) {
    $('#build_' + data.id + ' .log', this.element).append(Util.deansi(data.append_log));
  }
});

