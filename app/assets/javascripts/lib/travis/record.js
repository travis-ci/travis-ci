SC.RecordArray.prototype.whenReady = function(callback) {
  if(!callback) {
    return this;
  } else if(this.get('status') & SC.Record.READY) {
    callback(this);
  } else {
    // this.addObserver('status', function() {
    //   if(this.get('status') & SC.Record.READY) { callback(this); }
    // })
  }
  return this;
};

Travis.Record = SC.Record.extend({
  childRecordNamespace: Travis,
  primaryKey: 'id',
  id: SC.Record.attr(Number),

  isReady: function() {
    return this.get('status') & SC.Record.READY != 0;
  }, //.property(),

  update: function(attrs) {
    this.whenReady(function(record) {
      // TODO should not need to camelize here, should we? otherwise bindings seem to get stuck.
      $.each(attrs, function(key, value) {
        if(key != 'id') record.set($.camelize(key, false), value);
      });
    });
    return this;
  },

  whenReady: function(callback) {
    if(!callback) {
      return this;
    } else if(this.get('status') & SC.Record.READY) {
      callback(this);
    } else {
      // this.addObserver('status', function() {
      //   if(this.get('status') & SC.Record.READY) { callback(this); }
      // })
    }
    return this;
  }
});

Travis.Record.reopenClass({
  exists: function(id) {
    if(id === undefined) throw('id is undefined');
    return Travis.store.storeKeyExists(this, id);
  },

  createOrUpdate: function(attrs) {
    if(this.exists(attrs.id)) {
      return this.update(attrs);
    } else {
      return Travis.store.createRecord(this, attrs);
    }
  },

  update: function(attrs) {
    if(attrs.id === undefined) throw('id is undefined');
    var record = this.find(attrs.id);
    return record.update(attrs);
  },

  find: function(id, callback) {
    if(id === undefined) throw('id is undefined');
    var record = Travis.store.find(this, id);
    return record ? record.whenReady(callback) : record;
  },

  all: function(options, mode) {
    return Travis.store.find(Travis.Query.cached(this, options || {}, mode));
  }
});
