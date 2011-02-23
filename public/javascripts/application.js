var Travis = {
  Controllers: {}, Collections: {}, Helpers: {}, Models: {}, Views: {},
  start: function() {
    Backbone.history = new Backbone.History;
    Travis.app = new Travis.Controllers.Application;
    Travis.app.run();
  },
  trigger: function(event, data) {
    Travis.app.trigger(event, _.extend(data.build, { append_log: data.log }));
  }
};

if(!INIT_DATA) {
  var INIT_DATA = {};
}

$(document).ready(function() {
  if(!window.__TESTING__ && $('#application').length == 1) {
    Travis.start();
    Backbone.history.start();

    var channels = ['repositories', 'jobs'];
    // _.map(INIT_DATA.repositories || [], function(repository) { channels.push('repository_' + repository.id); });
    _.each(channels, function(channel) { pusher.subscribe(channel).bind_all(Travis.trigger); })
  }
});

Pusher.log = function() {
  if (window.console) {
    // window.console.log.apply(window.console, arguments);
  }
};

// Safari does not define bind()
if(!Function.prototype.bind) {
  Function.prototype.bind = function(binding) {
    return _.bind(this, binding);
  }
}

// Fix for [IE8 AJAX payload caching][1]
// [1]: http://stackoverflow.com/questions/1013637/unexpected-caching-of-ajax-results-in-ie8
$.ajaxSetup({ cache: false });

$(document).ready(function() {
  $('#profile').click(function() {
    console.log(this)
    $('#profile_menu').toggle();
  });
});
