Travis.Views.Build.History.Table = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'render', 'attachTo', 'buildAdded', 'update', 'appendRow', 'prependRow', 'renderRow', 'setTab');
    _.extend(this, this.options);
    this.template = Travis.app.templates['build/history/table'];
  },
  render: function() {
    this.el.html($(this.template({})));
    return this;
  },
  attachTo: function(repository) {
    this.repository = repository;
    this.setTab();
    this.repository.builds.bind('refresh', this.update);
    this.repository.builds.bind('load', this.update); // TODO
    this.repository.builds.whenLoaded(this.update);
  },
  buildAdded: function(build) {
    this.prependRow(build);
  },
  update: function() {
    this.$('tbody').empty();
    this.repository.builds.each(this.appendRow);
    this.repository.builds.bind('add', this.buildAdded);
  },
  appendRow: function(build) {
    this.$('tbody').append(this.renderRow(build));
  },
  prependRow: function(build) {
    this.$('tbody').prepend(this.renderRow(build));
  },
  renderRow: function(build) {
    return new Travis.Views.Build.History.Row({ model: build }).render().el;
  },
  setTab: function() {
    $('a', this.el.prev()).attr('href', '#!/' + this.repository.get('name') + '/builds');
  }
});
