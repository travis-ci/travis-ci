Travis.Views.Build.Build = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'attachTo', 'buildSelected');
    _.extend(this, this.options);

    if(this.repository) this.attachTo(repository);
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
    this.repository.builds().bind('select', this.buildSelected);

    if(this.parent) this.parent.setTab();
  },
  render: function() {
    this.el = $('<div></div>');
    if(this.repository) this.update();
    return this;
  },
  buildSelected: function(build) {
    this.build = build;
    this.update();
    if(this.parent) this.parent.setTab();
  },
  update: function() {
    this.el.empty();
    if(this.build) {
      this.renderSummary();
      this.build.matrix ? this.renderMatrix() : this.renderLog();
    }
  },
  renderSummary: function() {
    this.el.append(new Travis.Views.Build.Summary({ model: this.build }).render().el);
  },
  renderLog: function() {
    this.el.append(new Travis.Views.Build.Log({ model: this.build }).render().el);
  },
  renderMatrix: function() {
    this.el.append(new Travis.Views.Build.Matrix.Table({ builds: this.build.matrix }).render().el);
  },
  tab: function() {
    return this.build ? { url: '#!/' + this.repository.get('name') + '/builds/' + this.build.id, caption: 'Build ' + this.build.get('number') } : {};
  },
});
