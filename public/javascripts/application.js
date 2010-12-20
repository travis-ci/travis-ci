var Travis = {
  app: null,
  start: function() {
    Backbone.history = new Backbone.History;
    Travis.app = new ApplicationController;
    Travis.app.run();
  }
};

$(document).ready(function() {
  if(!window.__TESTING__) {
    Travis.start();
    Backbone.history.start();
  }

  Socky.prototype.respond_to_connect = function() {
    var repository_ids = _.map(INIT_DATA.repositories, function(repository) { return repository.id });
    this.connection.send('subscribe:{"repository":[' + repository_ids.join(',') + ']}')
  }

  Socky.prototype.respond_to_message = function(msg) {
    var data = JSON.parse(msg);
    // console.log('-- trigger: ' + data.event + ' message: ' + data.message);
    Travis.app.trigger(data.event, _.extend(data.build, { append_log: data.message }));
  }

  // fake github pings
  $('.github_ping').click(function(event) {
    $.post($(this).attr('href'), { payload: $(this).attr('data-payload') });
    event.preventDefault();
  });
});
