Travis.Record = SC.Record.extend({
  childRecordNamespace: Travis,
  primaryKey: 'id',
  id: SC.Record.attr(Number),

  update: function(attributes) {
    this.whenReady(function(record) {
      $.each(attributes, function(key, value) {
        this.set($.camelize(key, false), value); // TODO should not need to camelize here, should we? otherwise bindings seem to get stuck.
      }.bind(this));
    }.bind(this));
    return this;
  },

  whenReady: function(callback) {
    if(!callback) {
      return this;
    } else if(this.get('status') & SC.Record.READY) {
      callback(this);
    } else {
      this.addObserver('status', function() {
        if(this.get('status') & SC.Record.READY) { callback(this); }
      })
    }
    return this;
  }
});

Travis.Record.reopenClass({
  update: function(id, attributes) {
    var record = this.find(id);
    if(record) {
      record.whenReady(function(record) { record.update(attributes) });
    } else {
      throw('can not find %@ with id: %@'.fmt(this, id));
    }
    return record;
  },

  find: function(id, callback) {
    var record = Travis.store.find(this, id)
    return record ? record.whenReady(callback) : record;
  },

  all: function(options, mode) {
    return Travis.store.find(Travis.Query.cached(this, options || {}, mode));
  },
});
