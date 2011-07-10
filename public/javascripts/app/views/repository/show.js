Travis.Views.Repository.Show = Backbone.View.extend({
  tabs: {},
  initialize: function() {
    _.extend(this, this.options);
    _.bindAll(this, 'repositorySelected', '_createTab', '_renderTab', '_activateTab');

    this.template = Travis.templates['repository/show'];
    _.each(['current', 'history', 'build'], this._createTab);
  },
  render: function() {
    this.el = $(this.template({}));
    _.each(this.tabs, this._renderTab);
    return this;
  },
  detach: function() {
    if(this.collection) {
      this.collection.unbind('select', this.repositorySelected);
    }
  },
  attachTo: function(collection) {
    this.detach();
    this.collection = collection;
    this.collection.bind('select', this.repositorySelected);
  },
  repositorySelected: function(repository) {
    this.repository = repository;
    this._setTitle();
    _.each(this.tabs, function(tab) {
      tab.attachTo(repository);
    }.bind(this));
  },
  activateTab: function(name) {
    _.each(this.tabs, function(tab) { if(tab.name != name) tab.deactivate(); })
    this.tabs[name].activate();
  },
  _createTab: function(name) {
     this.tabs[name] = new Travis.Views.Repository.Tab({ name: name, parent: this  });
  },
  _renderTab: function(tab) {
    this.el.find('.tabs').append(tab.render().el);
  },
  _setTitle: function() {
    this.el.find('h3 a').attr('href', 'http://github.com/' + this.repository.get('slug')).text(this.repository.get('slug'));
    this.el.updateGithubStats(this.repository);
  }
});
