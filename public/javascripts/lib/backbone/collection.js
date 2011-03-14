Travis.Collections.Base = Backbone.Collection.extend({
  initialize: function() {
    Backbone.Collection.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'whenLoaded', 'selectLast', 'selectBy', 'select', 'deselect', 'getOrFetchLast', 'getOrFetchLastBy', 'getBy', 'fetchBy');
  },
  whenLoaded: function(callback, options) {
    if(this.loading) {
      this.bind('loaded', function() { this.unbind('loaded'); callback(this, options); }.bind(this));
    } else {
      callback(this, options);
    }
  },
  select: function(id) {
    this.getOrFetch(id, function(element) { if(element) element.select(); }.bind(this));
  },
  selectLast: function() {
    this.getOrFetchLast(function(element) { if(element) element.select(); }.bind(this))
  },
  selectBy: function(options) {
    this.getOrFetchLastBy(options, function(element) { if(element) element.select(); }.bind(this));
  },
  selected: function() {
    return this.detect(function(element) { return element.get('selected'); });
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
    } else {
      new this.model({ id: id }, { collection: this }).fetch({ success: callback });
    }
  },
  getOrFetchLastBy: function(options, callback) {
    var element = this.getBy(options);
    if(element) {
      callback(element);
    } else {
      this.fetchBy(options, function(collection) { callback(this.getBy(options)) }.bind(this));
    }
  },
  getBy: function(options) {
    return this.detect(function(element) {
      return _.all(options, function(value, name) { return element.get(name) == value; })
    });
  },
  fetchBy: function(options, callback) {
    this.options = options;
    this.fetch({ success: callback });
  },
});
Travis.Models.Base = Backbone.Model.extend({
  initialize: function() {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'select', 'deselect');
  },
  select: function() {
    this.collection.deselect();
    this.set({ selected: true });
    this.collection.trigger('select', this);
  },
  deselect: function() {
    this.set({ selected: false });
    this.collection.trigger('deselect', this);
  },
});

