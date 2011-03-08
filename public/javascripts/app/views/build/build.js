Travis.Views.Build.Build = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'render', 'attachTo', 'update', 'setTab');
    _.extend(this, this.options);
  },
  attachTo: function(repository) {
    this.repository = repository;
    this.repository.builds.bind('select', this.update);
    // this.repository.builds.whenLoaded(this.update);
  },
  update: function(build) {
    this.build = build;
    this.setTab();
    this.el.empty();
    this.el.append(new Travis.Views.Build.Summary({ model: this.build }).render().el);
    this.el.append(new Travis.Views.Build.Log({ model: this.build }).render().el);
  },
  setTab: function() {
    $('a', this.el.prev()).attr('href', '!/' + this.build.repository.get('name') + builds).html('Build #' + this.build.get('number'));
  }
});
