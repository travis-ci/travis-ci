Travis.Worker = Travis.Record.extend({
  primaryKey: 'uid',
  name: SC.Record.attr(String, { key: 'id' }),
});

Travis.Worker.reopenClass({
  resource: 'workers'
});

