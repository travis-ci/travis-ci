Travis.Collections.Base = Backbone.Collection.extend({
  initialize: function() {
    Backbone.Collection.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'whenFetched', 'selectLast', 'selectBy', 'select', 'deselect', 'getOrFetchLast', 'getOrFetchLastBy', 'getBy');
  },
  fetch: function(options) {
    options = options || {};
    var collection = this;
    this.startFetching();
    return Backbone.Collection.prototype.fetch.call(this, {
      success: function() {
        if(options.success) options.success.apply(this, arguments);
        collection.finishFetching();
      },
      error: function() {
        if(options.error) options.error.apply(this, arguments);
        collection.finishFetching();
      }
    });
  },
  whenFetched: function(callback, options) {
    if(!this.loaded || this.loading) {
      var collection = this;
      this.bind('loaded', function() { this.unbind('loaded'); return callback(collection, options); });
      if(!this.loading) this.fetch();
    } else {
      callback(this, options);
    }
  },
  selected: function() {
    return this.detect(function(element) { return element.selected; });
  },
  select: function(id) {
    this.getOrFetch(id, function(element) { if(element) element.select(); });
  },
  selectLast: function() {
    this.getOrFetchLast(function(element) { if(element) element.select(); })
  },
  selectBy: function(options) {
    this.getOrFetchLastBy(options, function(element) { if(element) element.select(); });
  },
  deselect: function() {
    var element = this.selected();
    if(element) element.deselect();
  },
  getOrFetchLast: function(callback) {
    if(this.length > 0) {
      callback(this.last());
    } else {
      this.fetch({ success: function() { callback(this.last()); }.bind(this) });
    }
  },
  getOrFetch: function(id, callback) {
    var element = this.get(id);
    if(element) {
      callback(element);
    } else if(!this.fetched) {
      this.whenFetched(function(collection) { callback(collection.get(id)); });
    }
  },
  getOrFetchLastBy: function(options, callback) {
    var element = this.getBy(options);
    if(element) {
      callback(element);
    } else {
      this.fetch({ success: function(collection) { callback(this.getBy(options)) }.bind(this) });
    }
  },
  getBy: function(options) {
    return this.detect(function(element) {
      return _.all(options, function(value, name) { return element.get(name) == value; })
    });
  },
  startFetching: function() {
    this.loading = true;
    this.trigger('load');
  },
  finishFetching: function() {
    this.trigger('loaded');
    this.loaded = true;
    this.loading = false;
  },
});

