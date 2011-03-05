Travis.Views.Build.Current = Travis.Views.Build.Build.extend({
  initialize: function(args) {
    this.selectors = this.selectors || {
      element: '#tab_current div'
    };
    Travis.Views.Build.Build.prototype.initialize.apply(this, arguments);
  },
  element: function() {
    return $('#tab_current div');
  },
  connect: function(build) {
    Travis.Views.Build.Build.prototype.connect.apply(this, arguments);
    build.collection.bind('add', this.connect);
    this.element().activateTab('current');
  },
  updateTab: function(repository) {
    $('h5 a', this.element().closest('li')).attr('href', '#!/' + repository.get('name'));
  },
});
