Travis.Views.Build.Current = Travis.Views.Build.Build.extend({
  tab: function() {
    return { url: '/#!/' + this.repository.get('name'), caption: 'Current' };
  },

  // TODO doesn't work because whenLoaded doesn't actually work. but this is the way it should be done,
  // so we can remove this bit of knowledge from the controller, right?
  //
  // attachTo: function(repository) {
  //   Travis.Views.Build.Build.prototype.attachTo.apply(this, arguments);
  //   repository.builds().whenLoaded(function(builds) { builds.last().select(); });
  // },
});


