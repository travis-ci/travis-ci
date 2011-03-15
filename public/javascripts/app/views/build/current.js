Travis.Views.Build.Current = Travis.Views.Build.Build.extend({
  tab: function() {
    return { url: '/#!/' + this.repository.get('name'), caption: 'Current' };
  },

  attachTo: function(repository) {
    Travis.Views.Build.Build.prototype.attachTo.apply(this, arguments);
    repository.builds.whenFetched(function(builds) { builds.last().select(); });
  },
});


