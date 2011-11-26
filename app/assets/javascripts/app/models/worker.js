Travis.WorkerGroup = SC.Object.extend({
  init: function() {
    this.set('workers', []);
  },

  host: function() {
    return this.getPath('workers.firstObject.host');
  }.property(),

  add: function(worker) {
    this.get('workers').push(worker);
  }
});

Travis.Worker = Travis.Record.extend({
  lastSeenAt: SC.Record.attr(String, { key: 'last_seen_at' })
});

Travis.Worker.reopenClass({
  resource: 'workers'
});

