var Travis = {
  app: null,
  start: function() {
    Backbone.history = new Backbone.History;
    Travis.app = new ApplicationController;
    Travis.app.run();
  },
  trigger: function(event, data) {
    Travis.app.trigger(event, _.extend(data.build, { append_log: data.log }));
  }
};

Pusher.log = function() {
  if (window.console) {
    // window.console.log.apply(window.console, arguments);
  }
};

$.fn.deansi = function() {
  this.html(Util.deansi(this.html()));
}

$(document).ready(function() {
  if(!window.__TESTING__) {
    Travis.start();
    Backbone.history.start();
  }

  _.each(INIT_DATA.repositories, function(repository) {
    var channel = pusher.subscribe('repository_' + repository.id);
    channel.bind_all(Travis.trigger);
  });

  // fake github pings
  $('.github_ping').click(function(event) {
    $.post($(this).attr('href'), { payload: $(this).attr('data-payload') });
    event.preventDefault();
  });
});
