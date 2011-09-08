// http://sproutcore-gyan.blogspot.com/2010/05/difference-between-local-remote-queries.html
// http://svarovsky-tomas.com/sproutcore-datasource.html

Travis.DataSource = SC.DataSource.extend({
  fetch: function(store, query) {
    var url = query.url || this._urlFor(query.get('recordType')) + '.json';

    $.ajax({
      url: url,
      dataType: 'json',
      success: function(data) {
        var store_keys = store.loadRecords(query.get('recordType'), data);
        if(!query.get('isLocal')) store.loadQueryResults(query, store_keys);
        store.dataSourceDidFetchQuery(query);
      },
      error: function(data, status, response) {
        // Actually i'm not absolutely sure what to put here
        store.dataSourceDidError(query);
      }
    });

    return YES;
  },

  retrieveRecord: function(store, storeKey) {
    var type = SC.Store.recordTypeFor(storeKey);
    var id   = store.idFor(storeKey);
    var url  = this._urlFor(type, id) + '.json';

    $.ajax({
      url: url,
      dataType: 'json',
      success: function(data, status, response) {
        store.loadRecords(store.recordTypeFor(storeKey), data.isEnumerable ? data : [data]);
      },
      error: function(data, status, response) {
        store.dataSourceDidError(storeKey, response.get('body'));
      }
    });

    return YES;
  },

  updateRecord: function(store, storeKey, params) {
    var type = store.recordTypeFor(storeKey);
    var id   = store.idFor(storeKey);
    var data = $.extend(store.readDataHash(storeKey), params || {}, { _method: 'put' });
    var url  = this._urlFor(type, id);

    $.post(url, data).done(function(data, status, response) {
      if(status == 'success') {
        store.dataSourceDidComplete(storeKey);
      } else {
        store.dataSourceDidError(storeKey, response);
      }
    });

    return YES;
  },

updateRecordDidComplete: function(response, store, storeKey, id) {
},

  _urlFor: function(recordType, id) {
    return $.compact([recordType.resource, id]).join('/');
  },

  _extractIds: function() {
    return data.map(function(hash) {
      var id = hash.id;
      delete hash.id;
      return id;
    }, this);
  },
});
