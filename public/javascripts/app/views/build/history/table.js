Travis.Views.Build.History.Table = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'render', 'detach', 'attachTo', 'buildAdded', 'update', 'prependRow');
    _.extend(this, this.options);
    this.template = Travis.templates['build/history/table'];

    if(this.repository) {
      this.attachTo(this.repository);
    }
  },
  detach: function() {
    if(this.builds) {
      this.builds.unbind('refresh');
      this.builds.unbind('add');
      delete this.repository;
      delete this.builds;
    }
  },
  attachTo: function(repository) {
    this.detach();
    this.repository = repository;
    this.builds = repository.builds();

    this.builds.bind('refresh', this.update);
    this.builds.bind('add', this.buildAdded);

    if(this.parent) this.parent.setTab();
  },
  render: function() {
    this.el = $(this.template({}));
    this.update();
    return this;
  },
  update: function() {
    this.el.find('tbody').empty();
    this.renderRows();
    if(this.parent && this.repository) this.parent.setTab();
  },
  buildAdded: function(build) {
    this.prependRow(build);
  },
  renderRows: function() {
    if(this.builds) {
      this.builds.each(this.prependRow);
    }
  },
  prependRow: function(build) {
    var row = new Travis.Views.Build.History.Row({ model: build }).render().el;
    this.el.find('tbody').prepend(row);
  },
  tab: function() {
    return { url: '#!/' + this.repository.get('name') + '/builds', caption: 'Build History' };
  },
});
