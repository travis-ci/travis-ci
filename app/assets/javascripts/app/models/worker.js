Travis.WorkerGroup = SC.Object.extend({
  init: function() {
    this.set('workers', []);
  },

  name: function() {
    return this.getPath('workers.firstObject.name');
  }.property(),

  add: function(worker) {
    this.get('workers').push(worker);
  },
});

Travis.Worker = Travis.Record.extend({
  id: SC.Record.attr(String, { key: 'id' }),

  name: function() {
    return this.get('id').split(':')[0];
  }.property('id'),

  process: function() {
    return this.get('id').split(':').slice(1).join(':');
  }.property('id')
});

Travis.Worker.reopenClass({
  resource: 'workers'
});

