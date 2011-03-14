Travis.Views.Build.Matrix.Table = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'render', 'attachTo', 'update', 'updateRow');
    _.extend(this, this.options);
    this.template = Travis.templates['build/matrix/table'];

    if(this.builds) {
      this.attachTo(this.builds);
    }
  },
  detach: function() {
    if(this.builds) {
      this.builds.unbind('refresh');
      this.builds.unbind('load');
      delete this.builds;
    }
  },
  attachTo: function(builds) {
    this.detach();
    this.builds = builds;
    this.builds.bind('refresh', this.update);
  },
  render: function() {
    this.el = $(this.template({ dimensions: this.builds.dimensions() }));
    this.update();
    this.attachTo(this.builds);
    return this;
  },
  update: function() {
    this.el.find('tbody').empty();
    this.builds.each(this.updateRow);
    this.builds.bind('add', this.buildAdded);
  },
  buildAdded: function(build) {
    this.updateRow(build);
  },
  updateRow: function(build) {
    var view = new Travis.Views.Build.Matrix.Row({ model: build });
    this.el.find('tbody').append(view.render().el);
  },
});
