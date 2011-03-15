Travis.Views.Build.History.Table = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'render', 'detach', 'attachTo', 'collectionRefreshed', 'buildAdded', '_update', '_prependRow', 'tab');
    _.extend(this, this.options);
    this.template = Travis.templates['build/history/table'];

    this.render();
    if(this.repository) {
      this.attachTo(this.repository);
    }
  },
  render: function() {
    this.el = $(this.template({}));
    this._update();
    return this;
  },
  detach: function() {
    if(this.builds) {
      this.builds.unbind('refresh', this.collectionRefreshed);
      this.builds.unbind('add', this.buildAdded);
      delete this.repository;
      delete this.builds;
    }
  },
  attachTo: function(repository) {
    this.detach();
    this.repository = repository;
    this.builds = repository.builds;

    this.builds.bind('refresh', this.collectionRefreshed);
    this.builds.bind('add', this.buildAdded);

    if(this.parent) this.parent.setTab();
    this._update();
  },
  collectionRefreshed: function() {
    this._update();
  },
  buildAdded: function(build) {
    this._prependRow(build);
  },
  _update: function() {
    this.el.find('tbody').empty();
    if(this.builds) this.builds.each(this._prependRow);
    if(this.parent && this.repository) this.parent.setTab();
  },
  _prependRow: function(build) {
    var row = new Travis.Views.Build.History.Row({ model: build }).render().el;
    this.el.find('tbody').prepend(row);
  },
  tab: function() {
    return { url: '#!/' + this.repository.get('name') + '/builds', caption: 'Build History' };
  },
});
