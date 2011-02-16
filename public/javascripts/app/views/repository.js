Travis.Views.Repository = Backbone.View.extend({
  initialize: function(args) {
    _.bindAll(this, 'bind', 'unbind', 'render'); // 'buildStarted', 'buildChanged', 'buildLogged');

    this.templates = {
      repository: args.app.templates['repositories/show'],
      tab:        args.app.templates['builds/_tab']
    }
    this.element = $('#main');

    this.currentView = new Travis.Views.CurrentBuild({ app: args.app });
    this.historyView = new Travis.Views.Builds({ app: args.app });
    this.buildView   = new Travis.Views.Build({ app: args.app });
  },
  unbind: function() {
    this.currentView.unbind();
    this.historyView.unbind();
    this.buildView.unbind();
  },
  render: function(repository, buildId, tab) {
    this.unbind();
    this.element.html($(this.templates.repository(_.extend(repository.toJSON({ includeBuild: false })))));
    this['render' + tab](repository, buildId);
    Travis.Helpers.Util.activateTab(this.element, tab);
  },
  renderCurrent: function(repository) {
    this.currentView.render(repository.builds.last());
  },
  renderHistory: function(repository) {
    this.historyView.render(repository);
  },
  renderBuild: function(repository, id) {
    repository.builds.retrieve(id, function(build) {
      // $('#tab_build', this.element).html(this.templates.tab({ repository: repository.toJSON({ includeBuild: false }), build: build.toJSON() }));
      this.buildView.render(build);
    }.bind(this));
  },
});
