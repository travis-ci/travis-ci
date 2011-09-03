// Travis.Query mostly encapsulates url generation based on the record type and
// given parameters.
//
// It also allows to cache queries so the same query object can be reused easily.
// (We need this because SC.Query.build does not support caching queries based on
// arbitrary parameters.)
Travis.Query = SC.Object.extend({
  init: function() {
    var options = this.get('options') || {};

    this.id = options.id;
    this._url = options.url;
    this.orderBy = options.orderBy || 'id';

    this.set('options', $.except(options, 'id', 'url', 'orderBy'));
  },

  toScLocalQuery: function() {
    return SC.Query.local(this.get('recordType'), { conditions: this.conditions(), url: this.url(), orderBy: this.orderBy });
  },

  url: function() {
    return this._url || $.compact([this.path(), this.params()]).join('?')
  },

  path: function() {
    return '/%@%@.json'.fmt(this.get('recordType').resource, (this.id ? '/' + this.id : ''))
  },

  params: function() {
    var params = $.map(this.get('options') || {}, function(value, name) {
      return '%@=%@'.fmt(name, encodeURIComponent(value));
    })
    if(params.length > 0) return params.join('&');
  },

  conditions: function() {
    var _this = this;
    return $.map(this.get('options') || {}, function(value, name) {
      return '%@ = %@'.fmt(name, _this.quote(name, value));
    }).join(' AND ');
  },

  quote: function(name, value) {
    return typeof value == 'string' ? '"%@"'.fmt(value) : value;
  }
});

$.extend(Travis.Query, {
  _cache: {},

  cached: function(recordType, options) {
    var attributes = { recordType: recordType, options: options };
    var key = this.key(attributes);
    return this._cache[key] ? this._cache[key] : this._cache[key] = this.create(attributes).toScLocalQuery();
  },

  key: function(attributes) {
    return this.create(attributes).url();
  }
});
