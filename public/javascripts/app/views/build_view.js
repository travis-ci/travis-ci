var BuildView = Backbone.View.extend({
  initialize: function(args) {
    _.bindAll(this, 'bind', 'unbind', 'render', 'build_log', 'build_updated', 'build_finished', 'update_summary', 'append_log');

    this.app = args.app;
    this.build = args.build;
    this.template = args.templates['builds/show'];
    this.element = $('#right');

    this.bind();
  },
  bind: function() {
    Backbone.Events.bind.apply(this, arguments);
    // this.build.repository.bind('changed', this.build_updated);
    this.app.bind('build:log', this.build_log);
    this.app.bind('build:finished', this.build_finished);
  },
  unbind: function() {
    Backbone.Events.unbind.apply(this, arguments);
    this.app.unbind('build:log', this.build_log);
    this.app.unbind('build:finished', this.build_finished);
  },
  render: function() {
    this.element.html($(this.template(this.build.toJSON())));
  },
  build_log: function(data) {
    this.append_log(data.id, data.append_log)
  },
  build_updated: function(repository) {
    // this.update_summary(repository.build.toJSON());
  },
  build_finished: function(data) {
    this.update_summary(data.repository.last_build);
  },
  update_summary: function(attributes) {
    $('#build_' + attributes.id + ' .summary', this.element).replaceWith($(this.template(attributes)));
  },
  append_log: function(id, chars) {
    $('#build_' + id + ' .log', this.element).append(Util.deansi(chars));
  }
});

