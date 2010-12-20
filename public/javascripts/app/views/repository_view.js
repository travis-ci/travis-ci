var RepositoryView = Backbone.View.extend({
  initialize: function(args) {
    _.bindAll(this, 'render', 'repository_changed', 'build_created', 'build_updated');

    this.app = args.app;
    this.repository = args.repository;
    this.repository_template = args.templates['repositories/show'];
    this.build_template = args.templates['builds/_summary'];
    this.element = $('#right');

    this.bind();
  },
  bind: function() {
    Backbone.Events.bind.apply(this, arguments);
    this.app.bind('build:created', this.build_created);
    this.app.bind('build:updated', this.build_updated);
    this.repository.bind('change', this.repository_changed);
  },
  unbind: function() {
    Backbone.Events.unbind.apply(this, arguments);
    this.app.unbind('build:created', this.build_created);
    this.app.unbind('build:updated', this.build_updated);
    if(this.repository) this.repository.unbind('change', this.repository_changed);
  },
  render: function() {
    this.element.html($(this.repository_template(this.repository.attributes)));
  },
  repository_changed: function(repository) {
    $('.summary', this.element).replaceWith($(this.build_template(this.repository.attributes.last_build)));
  },
  build_created: function(data) {
  },
  build_updated: function(data) {
    // $('#right #build_' + data.id + ' .log').append(Util.deansi(data.log));
    $('#right .log').append(Util.deansi(data.append_log));
  }
});

