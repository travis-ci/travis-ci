var RepositoryView = Backbone.View.extend({
  initialize: function(args) {
    _.bindAll(this, 'bind', 'unbind', 'render', 'build_created', 'build_updated', 'build_finished');

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
    this.app.bind('build:finished', this.build_finished);
  },
  unbind: function() {
    Backbone.Events.unbind.apply(this, arguments);
    this.app.unbind('build:created', this.build_created);
    this.app.unbind('build:updated', this.build_updated);
    this.app.unbind('build:finished', this.build_finished);
  },
  render: function() {
    this.element.html($(this.repository_template(this.repository.attributes)));
  },
  build_created: function(data) {
    if(this.is_current_repository(data)) {
      this.update_summary(data);
      this.clear_log();
    }
  },
  build_updated: function(data) {
    if(this.is_current_repository(data)) {
      this.append_log(data);
    }
  },
  build_finished: function(data) {
    if(this.is_current_repository(data)) {
      this.update_summary(data);
    }
  },
  is_current_repository: function(data) {
    return $('#repository_' + data.repository.id, this.element).length > 0;
  },
  update_summary: function(data) {
    $('.summary', this.element).replaceWith($(this.build_template(data.repository.last_build)));
  },
  clear_log: function() {
    $('.log', this.element).empty();
  },
  append_log: function(data) {
    $('.log', this.element).append(Util.deansi(data.append_log));
  }
});

