var RepositoryView = Backbone.View.extend({
  initialize: function(args) {
    _.bindAll(this, 'bind', 'unbind', 'render', 'render_log', 'render_history', 'build_started', 'build_changed', 'build_logged');

    this.app = args.app;
    this.repository = args.repository;
    this.repository_template = args.templates['repositories/show'];
    this.build_template = args.templates['builds/_summary'];
    this.element = $('#main');

    this.builds_list_view = new BuildsListView({ app: args.app, templates: args.templates });
  },
  bind: function() {
    Backbone.Events.bind.apply(this, arguments);
    if(this.repository) {
      this.repository.builds.bind('add', this.build_started);
      this.repository.builds.bind('change', this.build_changed);
      this.repository.builds.bind('log', this.build_logged);
    }
    this.builds_list_view.bind();
  },
  unbind: function() {
    Backbone.Events.unbind.apply(this, arguments);
    if(this.repository) {
      this.repository.builds.unbind('add', this.update_build);
      this.repository.builds.unbind('change', this.update_build);
      this.repository.builds.unbind('log', this.build_logged);
    }
    this.builds_list_view.unbind();
  },
  render: function(repository, tab) {
    this.tab = tab || 'log'
    this.repository = repository;
    this.bind();
    this.element.html($(this.repository_template(this.repository.toJSON())));
    this['render_' + this.tab]();
    Util.activate_tab(this.element, this.tab);
  },
  render_log: function() {
    $('.log', this.element).deansi();
  },
  render_history: function() {
    this.builds_list_view.render(this.repository, $('#tab_history div', this.element));
  },
  build_started: function(build) {
    this.unbind();
    this.render(build.repository(), this.tab);
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

