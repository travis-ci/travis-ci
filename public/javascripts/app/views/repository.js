Travis.Views.Repository = Backbone.View.extend({
  initialize: function(args) {
    _.bindAll(this, 'bind', 'unbind', 'render', 'connect'); // 'buildStarted', 'buildChanged', 'buildLogged');

    this.templates = {
      show: args.templates['repositories/show'],
      tab:  args.templates['builds/_tab']
    }
    this.render();

    this.currentView = new Travis.Views.CurrentBuild(args);
    this.buildsView  = new Travis.Views.Builds(args);
    this.buildView   = new Travis.Views.Build(args);
  },
  element: function(repository) {
    return $('#main');
  },
  render: function(repository, buildId, tab) {
    this.element().html($(this.templates.show({})));
  },
  connect: function(args) {
    this.disconnect();

    this.model   = args.repository;
    this.buildId = args.buildId;
    this.tab     = args.tab || 'Current';

    this._updateTitle();
    this._updateTabs();

    this['_render' + this.tab]();
    this.element().activateTab(this.tab);
  },
  disconnect: function() {
    this.currentView.disconnect();
    this.buildsView.disconnect();
    this.buildView.disconnect();
    delete this.model;
  },
  _renderCurrent: function() {
    this.currentView.connect(this.model.builds.last());
  },
  _renderHistory: function() {
    this.buildsView.connect(this.model.builds);
  },
  _renderBuild: function() {
    this.model.builds.retrieve(this.buildId, function(build) {
      this.buildView.updateTab(build);
      this.buildView.connect(build);
    }.bind(this));
  },
  _updateTitle: function() {
    $('.repository h3 a', this.element()).attr('href', this.model.get('url')).html(this.model.get('name'));
  },
  _updateTabs: function() {
    this.currentView.updateTab(this.model);
    this.buildsView.updateTab(this.model);
  }
});
