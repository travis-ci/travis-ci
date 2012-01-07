Ember.RecordArray.prototype.whenReady = function(callback) {
  if(!callback) {
    return this;
  } else if(this.get('status') & Ember.Record.READY) {
    callback(this);
  } else {
    // this.addObserver('status', function() {
    //   if(this.get('status') & Ember.Record.READY) { callback(this); }
    // })
  }
  return this;
};

Travis.Record = Ember.Record.extend({
  childRecordNamespace: Travis,
  primaryKey: 'id',
  id: Ember.Record.attr(Number),

  isReady: function() {
    return (this.get('status') & Ember.Record.READY) != 0;
  }.property(),

  update: function(attrs) {
    this.whenReady(function(record) {
      $.each(attrs, function(key, value) {
        if(key != 'id') record.set(key, value);
      });
    });
    return this;
  },

  whenReady: function(callback) {
    if(!callback) {
      return this;
    } else if(this.get('isReady')) {
      callback(this);
    } else {
      // this.addObserver('status', function() {
      //   if(this.get('status') & Ember.Record.READY) { callback(this); }
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
