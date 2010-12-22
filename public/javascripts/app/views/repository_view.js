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
    this.element.html($(this.repository_template(this.repository.attributes)));
  },
  repository_changed: function(repository) {
    // happens on build:started and build:finished
    if(this.is_current_repository(repository.get('id'))) {
      var build = repository.attributes.last_build;
      this.update_summary(build);
      this.update_log(build);
    }
  },
  build_log: function(data) {
    if(this.is_current_repository(data.repository.id)) {
      this.append_log(data.append_log);
    }
  },
  is_current_repository: function(id) {
    return $('#repository_' + id, this.element).length > 0;
  },
  update_summary: function(build) {
    $('.summary', this.element).replaceWith($(this.build_template(build)));
  },
  update_log: function(build) {
    $('.log', this.element).text(build.log);
  },
  append_log: function(chars) {
    $('.log', this.element).append(Util.deansi(chars));
  }
});

