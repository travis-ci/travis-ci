Travis.Views.Build.Current = Travis.Views.Build.Build.extend({
  updateTab: function() {
    $('#tab_current h5 a').attr('href', '/#!/' + this.repository.get('slug'));
  },
  // attachTo: function(repository) {
  //   Travis.Views.Build.Build.prototype.attachTo.apply(this, arguments);
  //   attach to selecting repository.builds adding new builds
  // },
});


