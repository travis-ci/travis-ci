Travis.Views.Build.List = Travis.Views.Base.List.extend({
  name: 'builds',
  selectors: {
    element: '#tab_history div',
    list: '#tab_history tbody'
  },
  // collection_events: {
  //   'builds:load:start': 'startLoading',
  //   'builds:load:done': 'stopLoading'
  // },
  connect: function(collection) {
    Travis.Views.Base.List.prototype.connect.apply(this, arguments);
    collection.fetch();
  },
  disconnect: function() {
    if(this.repository) {
      this.repository.builds.unbind('add', this.buildAdded);
      this.repository.builds.unbind('change', this.buildChanged);
    }
  },
  collectionRefreshed: function() {
    Travis.Views.Base.List.prototype.collectionRefreshed.apply(this, arguments);
    this.element().updateTimes();
  },
  elementAdded: function(build) {
    Travis.Views.Base.List.prototype.elementAdded.apply(this, arguments);
    this.element().updateTimes();
  },
  elementChanged: function(build) {
    $('tr#builds_' + build.id, this.element()).html($(this.templates.item(build.toJSON())));
  },
  updateTab: function(repository) {
    $('h5 a', this.element().closest('li')).attr('href', '#!/' + repository.get('name') + '/builds');
  },
});
