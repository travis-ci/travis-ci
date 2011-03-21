Travis.Views.Build.Matrix.Table = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'render', 'attachTo', 'collectionRefreshed', 'buildAdded', '_update', '_prependRow');
    _.extend(this, this.options);
    this.template = Travis.templates['build/matrix/table'];
    if(this.builds) this.attachTo(this.builds);
  },
  detach: function() {
    if(this.builds) {
      this.builds.unbind('refresh', this.collectionRefreshed);
      delete this.builds;
    }
  },
  attachTo: function(builds) {
    this.detach();
    this.builds = builds;
    this.builds.bind('refresh', this.collectionRefreshed);
  },
  render: function() {
    this.el = $(this.template({ dimensions: this.builds.dimensions() }));
    this._update();
    this.attachTo(this.builds);
    return this;
  },
  collectionRefreshed: function() {
    this._update();
  },
  buildAdded: function(build) {
    this._prependRow(build);
  },
  _update: function() {
    this.el.find('tbody').empty();
    this.builds.each(this._prependRow);
    this.builds.bind('add', this._buildAdded);
  },
  _prependRow: function(build) {
    var view = new Travis.Views.Build.Matrix.Row({ model: build });
    this.el.find('tbody').prepend(view.render().el);
  },
});
