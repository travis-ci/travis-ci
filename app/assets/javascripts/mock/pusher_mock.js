/*
 * Pretty primitive pusher mock. Basically it disallows connections through websocket and logs all the incoming requests for future assets.
 * It exposes pretty much the same interface as pusher would expose to sender/receiver. For now, works best with events sent from server to client
 * side. Client to server specs & evaluation is still WIP.
 *
 * For Capybara tests, please usr trigger function.
 */

var PusherMock = function(pusher) {
  this.pusher = pusher;
};

PusherMock.prototype = {
  message_stack: [],
  connection_open: false,
  dispatch_message: function() {
    this.message_stack.push(arguments[0]);
    this.onmessage(arguments)
  },
  receive_message: function() {
    this.message_stack.push(arguments[0]);
    this.onmessage(arguments)
  },
  open_connection: function() {
    this.pusher.send_local_event("connection_established", { socket_id: 123 }, 'jobs');
    this.pusher.connection = {};
    this.pusher.connection.open = function () {
      Pusher.log ("connection open")
    };
    this.pusher.connection.close = function () {
      Pusher.log ("connection close")
    };

    this.onopen()
  },
  close_connection: function() {
    this.onclose()
  }
};

Pusher.prototype.connect = function() {
  window.pusher_mock = new PusherMock(this);

  var self = this;

  window.pusher_mock.onmessage = function(arguments) {
    self.onmessage.apply(self, [ { data: arguments[0] } ]);
  };
  window.pusher_mock.onclose = function() {
    self.onclose.apply(self, arguments);
  };
  window.pusher_mock.onopen = function() {
    self.onopen.apply(self, arguments);
  };

};

function trigger(channel, event, data, socket_id) {
  window.pusher_mock.dispatch_message(JSON.stringify({
    channel: channel,
    event: event,
    data: data,
    socket_id: socket_id
  }));
}
