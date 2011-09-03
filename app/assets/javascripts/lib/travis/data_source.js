Travis.DataSource = SC.DataSource.extend({
  fetch: function(store, query) {
    var url = query.url || this._urlFor(query.get('recordType'));

    $.ajax({ url: url }).done(function(data) {
      store.loadRecords(query.get('recordType'), data); // , this._extractIds(data)
      store.dataSourceDidFetchQuery(query);
    });

    return YES;
  },

  retrieveRecord: function(store, storeKey) {
    var type = SC.Store.recordTypeFor(storeKey);
    var id   = store.idFor(storeKey);
    var url  = this._urlFor(type, id);

    $.ajax({ url: url, dataType: 'json' }).done(function(data, status, response) {
      if (SC.ok(response)) {
        store.loadRecords(store.recordTypeFor(storeKey), data.isEnumerable ? data : [data]);
      } else {
        store.dataSourceDidError(storeKey, response.get('body'));
      }
    });

    return YES;
  },

  _urlFor: function(recordType, id) {
    return $.compact([recordType.resource, id]).join('/') + '.json';
  },

  _extractIds: function() {
    return data.map(function(hash) {
      var id = hash.id;
      delete hash.id;
      return id;
    }, this);
  },
});
