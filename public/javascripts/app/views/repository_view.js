var RepositoryView = Backbone.View.extend({
  initialize: function(args) {
    _.bindAll(this, 'bind', 'unbind', 'render', 'repository_changed', 'build_log');

    this.app = args.app;
    this.repository = args.repository;
    this.repository_template = args.templates['repositories/show'];
    this.build_template = args.templates['builds/_summary'];
    this.element = $('#right');

    this.bind();
  },
  bind: function() {
    Backbone.Events.bind.apply(this, arguments);
    this.repository.bind('change', this.repository_changed);
    this.app.bind('build:log', this.build_log);
  },
  unbind: function() {
    Backbone.Events.unbind.apply(this, arguments);
    this.repository.unbind('change', this.repository_changed);
    this.app.unbind('build:updated', this.build_log);
  },
  render: function() {
    this.element.html($(this.repository_template(this.repository.toJSON())));
    $('.log', this.element).deansi();
  },
  repository_changed: function(repository) {
    // happens on build:started and build:finished
    this.update_summary(repository.id, repository.build.toJSON());
    this.update_log(repository.id, repository.build.get('log'));
  },
  build_log: function(data) {
    this.append_log(data.repository.id, data.append_log);
  },
  update_summary: function(id, attributes) {
    $('#repository_' + id + ' .summary', this.element).replaceWith($(this.build_template(attributes)));
  },
  update_log: function(id, log) {
    $('#repository_' + id + ' .log', this.element).html(log).deansi();
  },
  append_log: function(id, chars) {
    $('#repository_' + id + ' .log', this.element).append(chars).deansi();
  },
});

