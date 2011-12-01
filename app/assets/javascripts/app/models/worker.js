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
  lastSeenAt: SC.Record.attr(String, { key: 'last_seen_at' }),

  number: function() {
    return this.get('name').match(/\d+$/)[0];
  }.property(),

  display: function() {
    var name = this.get('name').replace('travis-', '');
    var state = this.get('state');
    var payload = this.get('payload');

    if(state == 'working' && payload != undefined) {
      var repository = payload.repository ? $.truncate(payload.repository.slug, 18) : undefined;
      var number = payload.build && payload.build.number ? ' #' + payload.build.number : '';
      var state = repository ? repository + number : state;
    }

    return name + ': ' + state;
  }.property()
});

Travis.Worker.reopenClass({
  resource: 'workers'
});

