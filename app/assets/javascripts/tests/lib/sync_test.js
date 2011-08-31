describe('The message synchronizer', function() {
  var msg_ids = function(messages) {
    return _.map(messages, function(message) { return message[1].msg_id });
  };

  it('sorts messages by their msg_id', function() {
    var sync = new Travis.Synchronizer();
    sync.push('build:log', { msg_id: 1 });
    sync.push('build:log', { msg_id: 3 });
    sync.push('build:log', { msg_id: 2 });

    expect(_.map(sync.messages, function(message) { return message[1].msg_id })).toEqual([1, 2, 3]);
  });

  it('forwards messages in a synchronized order', function() {
    var receiver = [];
    var sync = new Travis.Synchronizer(function() { receiver.push(arguments); });
    var messages = [
      ['build:log', { msg_id: 1 }],
      ['build:log', { msg_id: 2 }],
      ['build:log', { msg_id: 3 }]
    ];

    sync.receive.apply(sync, messages[0]);
    sync.receive.apply(sync, messages[2]);
    sync.receive.apply(sync, messages[1]);

    expect(receiver).toEqual(messages);
  });

  it('buffers messages if their preceeding message has not yet been forwarded', function() {
    var receiver = [];
    var sync = new Travis.Synchronizer(function() { receiver.push(arguments); });
    var messages = [
      ['build:log', { msg_id: 1 }],
      ['build:log', { msg_id: 3 }],
      ['build:log', { msg_id: 4 }]
    ];

    sync.receive.apply(sync, messages[0]);
    sync.receive.apply(sync, messages[1]);
    sync.receive.apply(sync, messages[2]);

    expect(receiver).toEqual(messages.slice(0, 1));
    expect(msg_ids(sync.messages)).toEqual([3, 4]);
  });

  it('synchronizes a bunch of messages', function() {
    var receiver = [];
    var sync = new Travis.Synchronizer(function() { receiver.push(arguments); });
    var push = function(msg_id) { sync.receive('build:log', { msg_id: msg_id }); };
    var rand = function() { return Math.floor(Math.random() * 50); };
    var ids  = [];

    _.times(200, function(ix) { setTimeout(push, rand(), ix + 1); ids.push(ix + 1) });

    runsAfter(200, function() {
      expect(sync.messages).toBeEmpty();
      expect(msg_ids(receiver)).toEqual(ids);
    })
  });

  it('synchronizes messages by their build id', function() {
    var receiver = [];
    var messages = [
      ['build:log', { msg_id: 1, build: { id: 1 } }],
      ['build:log', { msg_id: 1, build: { id: 2 } }],
      ['build:log', { msg_id: 3, build: { id: 2 } }],
      ['build:log', { msg_id: 3, build: { id: 1 } }],
      ['build:log', { msg_id: 2, build: { id: 1 } }],
      ['build:log', { msg_id: 2, build: { id: 2 } }],
    ];

    _.each(messages, function(message) {
      Travis.Synchronizer.receive(message[0], message[1], function() { receiver.push(arguments); });
    });

    _.each(Travis.Synchronizer.synchronizers, function(sync) {
      expect(sync.messages).toBeEmpty();
    });
    expect(msg_ids(receiver)).toEqual([1, 1, 2, 3, 2, 3]);
  });
});
