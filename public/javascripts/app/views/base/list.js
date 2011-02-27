// Base component for displaying a collection as a list element
//
Travis.Views.Base.List = Backbone.View.extend({
  initialize: function(args) {
    _.bindAll(this, 'element', 'render', 'connect', 'disconnect', 'elementAdded', 'elementRemoved', 'collectionRefreshed');

    this.selectors = _.extend({
      element: '#' + this.name,
      list: '#' + this.name + ' ul',
      item: '#' + this.name + ' #' +this.name.replace(/s$/, '') + '_'
    }, this.selectors || {});

    this.templates = _.extend({
      list: args.templates[this.name + '/list'],
      item: args.templates[this.name + '/_item']
    }, this.templates || {});

    this.collection_events = _.extend({
      add: 'elementAdded',
      remove: 'elementRemoved',
      refresh: 'collectionRefreshed'
    }, this.collection_events || {});

    this.render();
    return this;
  },
  element: function() {
    return $(this.selectors.element);
  },
  render: function() {
    this.element().replaceWith(this.templates.list({}));
    // this.element().addClass('loading');
  },
  connected: function() {
    return !!this.collection;
  },
  connect: function(collection) {
    this.disconnect();
    this.collection = collection;
    this._bind(collection, this.collection_events);
    if(collection.length > 0) this._renderItems();
  },
  disconnect: function() {
    if(this.collection) {
      this._unbind(this.collection, this.collection_events);
      delete this.collection;
      delete this._element;
    }
  },
  elementAdded: function(item) {
    this._renderItem(item);
  },
  elementRemoved: function(item) {
    $(this.selector + '' + this.selectors.item + job.get('id'), this.element()).remove();
  },
  collectionRefreshed: function(collection) {
    this._renderItems();
    this.element().removeClass('loading');
  },
  _bind: function(target, events) {
    _.each(events, function(callback, name) { target.bind(name, this[callback]); }.bind(this));
  },
  _unbind: function(target, events) {
    _.each(events, function(callback, name) { target.unbind(name); }.bind(this));
  },
  _renderItem: function(item) {
    $(this.selectors.list).prepend($(this.templates.item(item.toJSON())));
  },
  _renderItems: function() {
    $('*:not(.empty)', this.selectors.list).remove();
    _.each(this.collection.models, this._renderItem.bind(this));
    this.element().removeClass('loading');
  },
});

