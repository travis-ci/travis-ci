Travis.Synchronizer = function(forward) {
  this.forward  = forward;
  this.messages = [];
  this.lastId   = 0;
}
_.extend(Travis.Synchronizer, {
  synchronizers: {},
  receive: function(event, data, forward) {
    var buildId = data.build.id;
    this.synchronizers[buildId] = this.synchronizers[buildId] || new Travis.Synchronizer(forward);
    this.synchronizers[buildId].receive(event, data);
  }
});

_.extend(Travis.Synchronizer.prototype, {
  receive: function(event, data) {
    if(data.msg_id) {
      this.synchronize(event, data);
    } else {
      this.forward.apply(this, arguments);
    }
  },
  synchronize: function(event, data) {
    this.push(event, data);
    while(this.messages[0] && this.lastId == this.messages[0][1].msg_id - 1) {
      this.lastId = this.messages[0][1].msg_id;
      this.forward.apply(this, this.messages.shift());
    }
  },
  push: function() {
    this.messages.push(arguments);
    this.sort();
  },
  sort: function() {
    this.messages.sort(function(lft, rgt) { return lft[1].msg_id - rgt[1].msg_id; });
  },
});

Travis.receive = function(event, data) {
  // Travis.Synchronizer.receive(event, data, Travis.trigger);
  Travis.trigger(event, data);
};

