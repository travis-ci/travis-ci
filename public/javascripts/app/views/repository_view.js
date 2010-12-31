var RepositoryView = Backbone.View.extend({
  initialize: function(args) {
    _.bindAll(this, 'bind', 'unbind', 'render', 'build_started', 'build_changed', 'build_logged');

    this.app = args.app;
    this.repository = args.repository;
    this.repository_template = args.templates['repositories/show'];
    this.build_template = args.templates['builds/_summary'];
    this.element = $('#right');
  },
  bind: function() {
    Backbone.Events.bind.apply(this, arguments);
    this.repository.builds.bind('add', this.build_started);
    this.repository.builds.bind('change', this.build_changed);
    this.repository.builds.bind('log', this.build_logged);
  },
  unbind: function() {
    Backbone.Events.unbind.apply(this, arguments);
    if(this.repository) {
      this.repository.builds.unbind('add', this.update_build);
      this.repository.builds.unbind('change', this.update_build);
      this.repository.builds.unbind('log', this.build_logged);
    }
  },
  render: function(repository) {
    this.repository = repository;
    this.bind();
    this.element.html($(this.repository_template(this.repository.toJSON())));
    $('.log', this.element).deansi();
  },
  build_started: function(build) {
    this.unbind();
    this.render(build.repository());
  },
  build_changed: function(build) {
    $('#repository_' + build.repository().id + ' .summary', this.element).replaceWith($(this.build_template(build.toJSON())));
    Util.update_times();
  },
  build_logged: function(build, chars) {
    var element = $('#build_' + build.id + ' .log', this.element);
    element.append(chars);
    element.deansi();
  },
});

