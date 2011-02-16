Travis.Views.CurrentBuild = Travis.Views.Build.extend({
  initialize: function(args) {
    Travis.Views.Build.prototype.initialize.apply(this, arguments);
    this.templates.show = args.app.templates['builds/current'];
  },
  element: function() {
    return $('#tab_current div');
  },
  bind: function(build) {
    build.collection.bind('add', this.render);
    Travis.Views.Build.prototype.bind.apply(this, arguments);
  },
});
