Travis.Views.Build.Current = Travis.Views.Build.Build.extend({
  updateTab: function() {
    $('#tab_current h5 a').attr('href', '/#!/' + this.repository.get('name'));
  },
});


