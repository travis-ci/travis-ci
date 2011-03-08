Travis.Views.Build.Matrix.Table = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'render', 'attachTo', 'update', 'updateRow');
    _.extend(this, this.options);
    this.template = Travis.app.templates['build/matrix/table'];
  },
  render: function() {
    this.el = $(this.template({}));
    this.update();
    this.attachTo(this.builds);
    return this;
  },
  attachTo: function(builds) {
    this.builds.bind('refresh', this.update);
    this.builds.bind('load', this.update); // TODO
  },
  buildAdded: function(build) {
    this.updateRow(build);
  },
  update: function() {
    this.$('tbody').empty();
    this.builds.each(this.updateRow);
    this.builds.bind('add', this.buildAdded);
  },
  updateRow: function(build) {
    var view = new Travis.Views.Build.Matrix.Row({ model: build });
    this.$('tbody').prepend(view.render().el);
  },
});
