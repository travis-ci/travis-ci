Travis.Views.Repository.Show = Backbone.View.extend({
  tabs: {},
  initialize: function() {
    _.extend(this, this.options);
    _.bindAll(this, 'render', 'attachTo', 'createTab', 'renderTab', 'activateTab', 'repositorySelected');

    this.template = Travis.templates['repository/show'];
    _.each(['current', 'history', 'build'], this.createTab);
  },
  detach: function() {
    if(this.collection) {
      this.collection.unbind('select', this.repositorySelected);
    }
  },
  attachTo: function(collection) {
    this.collection = collection;
    this.collection.bind('select', this.repositorySelected);
  },
  render: function() {
    this.el = $(this.template({}));
    // this.el.addClass('loading');
    _.each(this.tabs, this.renderTab);
    return this;
  },
  createTab: function(name) {
    this.tabs[name] = new Travis.Views.Repository.Tab({ name: name });
  },
  renderTab: function(tab) {
    this.el.find('.tabs').append(tab.render().el);
  },
  activateTab: function(name, buildId) {
    _.each(this.tabs, function(tab) { if(tab.name != name) tab.deactivate(); })
    this.tabs[name].activate(buildId);
  },
  repositorySelected: function(repository) {
    this.repository = repository;
    this.setTitle();
    _.each(this.tabs, function(tab) { tab.attachTo(repository); }.bind(this));
  },
  setTitle: function() {
    this.el.find('h3 a').attr('href', 'http://github.com/' + this.repository.get('name')).text(this.repository.get('name'));
  }
});
