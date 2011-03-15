Travis.Views.Build.Build = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'attachTo', 'buildSelected');
    _.extend(this, this.options);

    this.el = $('<div></div>');
    if(this.repository) {
      this.render();
      this.attachTo(this.repository);
    }
  },
  render: function() {
    if(this.repository) this._update();
    return this;
  },
  detach: function() {
    if(this.builds) {
      this.builds.unbind('select', this.buildSelected);
      delete this.repository;
    }
  },
  attachTo: function(repository) {
    this.detach();
    this.repository = repository;
    this.repository.builds.bind('select', this.buildSelected);

    this._update();
    if(this.parent) this.parent.setTab();
  },
  buildSelected: function(build) {
    this.build = build;
    this._update();
    if(this.parent) this.parent.setTab();
  },
  _update: function() {
    this.el.empty();
    if(this.build) {
      this._renderSummary();
      this.build.matrix ? this._renderMatrix() : this._renderLog();
    }
  },
  _renderSummary: function() {
    this.el.append(new Travis.Views.Build.Summary({ model: this.build }).render().el);
  },
  _renderLog: function() {
    this.el.append(new Travis.Views.Build.Log({ model: this.build }).render().el);
  },
  _renderMatrix: function() {
    this.el.append(new Travis.Views.Build.Matrix.Table({ builds: this.build.matrix }).render().el);
  },
  tab: function() {
    return this.build ? { url: '#!/' + this.repository.get('name') + '/builds/' + this.build.id, caption: 'Build ' + this.build.get('number') } : {};
  },
});
