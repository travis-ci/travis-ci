Travis.Views.Build.History.Table = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'render', 'detach', 'attachTo', 'collectionRefreshed', 'buildAdded', '_update', '_prependRow', 'tab', 'updateTab');
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

    this._update();
    this.updateTab();
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
    if(this.parent && this.repository) this.parent.updateTab();
  },
  _prependRow: function(build) {
    if(!build.get('parent_id')) {
      this.el.find('tbody').prepend(new Travis.Views.Build.History.Row({ model: build }).render().el);
    }
  },
  updateTab: function() {
    $('#tab_history h5 a').attr('href', '#!/' + this.repository.get('slug') + '/builds');
  },
});
