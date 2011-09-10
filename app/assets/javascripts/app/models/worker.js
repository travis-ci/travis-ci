Travis.Worker = Travis.Record.extend({
  primaryKey: 'id',
  id: SC.Record.attr(String, { key: 'id' }),
});

Travis.Worker.reopenClass({
  resource: 'workers'
});

