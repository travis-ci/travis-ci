var BuildView = Backbone.View.extend({
  initialize: function(app) {
    _.bindAll(this, 'render', 'build_updated');

    this.template = app.templates['builds/show'];
    this.element = $('#right');
    this.app = app;

    this.bind();
  },
  bind: function() {
    Backbone.Events.bind.apply(this, arguments);
    // TODO should bind to the specific repository it's rendering
    this.app.bind('build:updated', this.build_updated);
  },
  unbind: function() {
    Backbone.Events.unbind.apply(this, arguments);
    this.app.unbind('build:updated', this.build_updated);
  },
  render: function(build) {
    this.element.html($(this.template(build.attributes)));
  },
  build_updated: function(data) {
    var log = $('#right #build_' + data.id + ' .log');
    log.append(Util.deansi(data.log));
  }
});

