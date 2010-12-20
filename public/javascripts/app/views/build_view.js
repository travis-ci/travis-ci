var BuildView = Backbone.View.extend({
  initialize: function(args) {
    _.bindAll(this, 'render', 'build_updated');

    this.app = args.app;
    this.build = args.build;
    this.template = args.templates['builds/show'];
    this.element = $('#right');

    this.bind();
  },
  bind: function() {
    Backbone.Events.bind.apply(this, arguments);
    // TODO should this bind to the specific build it's rendering? there's no model for it though.
    this.app.bind('build:updated', this.build_updated);
  },
  unbind: function() {
    Backbone.Events.unbind.apply(this, arguments);
    this.app.unbind('build:updated', this.build_updated);
  },
  render: function() {
    this.element.html($(this.template(this.build.attributes)));
  },
  build_updated: function(data) {
    $('#right #build_' + data.id + ' .log').append(Util.deansi(data.append_log));
  }
});

