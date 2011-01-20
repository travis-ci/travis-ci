var RepositoryView = Backbone.View.extend({
  initialize: function(args) {
    _.bindAll(this, 'bind', 'unbind', 'render'); // 'build_started', 'build_changed', 'build_logged');

    this.app = args.app;
    this.repository_template = args.app.templates['repositories/show'];
    this.build_template = args.app.templates['builds/show'];
    this.tab_template = args.app.templates['builds/_tab'];
    this.element = $('#main');

    this.current_view = new CurrentBuildView({ app: args.app });
    this.history_view = new BuildsListView({ app: args.app });
    this.build_view   = new BuildView({ app: args.app });
  },
  unbind: function() {
    this.current_view.unbind();
    this.history_view.unbind();
    this.build_view.unbind();
  },
  render: function(repository, build_id, tab) {
    this.unbind();
    this.element.html($(this.repository_template(_.extend(repository.toJSON({ include_build: false })))));
    this['render_' + tab](repository, build_id);
    Util.activate_tab(this.element, tab);
  },
  render_current: function(repository) {
    this.current_view.render(repository.builds.last());
  },
  render_history: function(repository) {
    this.history_view.render(repository);
  },
  render_build: function(repository, build_id) {
    repository.builds.retrieve(build_id, function(build) {
      $('#tab_build', this.element).html(this.tab_template({ repository: repository.toJSON({ include_build: false }), build: build.toJSON() }));
      this.build_view.render(build);
    }.bind(this));
  },
});
