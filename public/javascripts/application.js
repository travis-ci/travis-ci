var Travis = {
  Controllers: {}, Collections: {}, Helpers: {}, Models: {}, Views: { Base: {}, Build: { History: {}, Matrix: {} }, Jobs: {}, Repositories: {}, Repository: {}, Workers: {} },
  start: function() {
    Travis.templates = Utils.loadTemplates();
    Backbone.history = new Backbone.History;
    Travis.app = new Travis.Controllers.Application();
    Travis.app.run();
  },
  trigger: function(event, data) {
    var repository = _.extend(data.repository, { build: _.clone(data.build) });
    _.each(['id', 'number', 'status', 'started_at', 'finished_at'], function(key) {
      if(_.key(data.build, key)) repository['last_build_' + key] = data.build[key];
    });
    if(data.log) repository.log = data.log;
    Travis.app.trigger(event, repository);
  }
};

$(document).ready(function() {
  if(!window.__TESTING__ && $('#application').length == 1) {
    Travis.start();
    Backbone.history.start();

    var channels = ['repositories', 'jobs'];
    _.each(channels, function(channel) { pusher.subscribe(channel).bind_all(Travis.receive); })
  } else {
    Travis.templates = Utils.loadTemplates();
  }

  $('#profile').click(function() { $('#profile_menu').toggle(); });
  $('.tool-tip').tipsy({ gravity: 'n', fade: true });
  $('.fold').live('click', function() { $(this).hasClass('open') ? $(this).removeClass('open') : $(this).addClass('open'); })

  if(env == 'development') {
    $('#jobs').after(Travis.templates['tools/events']());
    var events = {
      'build:queued':   { 'repository': { 'id': 3, 'name': 'travis-ci/travis-ci' }, 'build': { 'id': 4, 'number': 46 } },
      'build:started':  { 'repository': { 'id': 1, 'name': 'svenfuchs/minimal' }, 'build': { 'id': 9, 'number': 4, 'commit': '4df463d5082448b58ea7367df6c4a9b5e059c9ca', 'author_name': 'Sven Fuchs', 'author_email': 'svenfuchs@artweb-design.de', 'committer_name': 'Sven Fuchs', 'committer_email': 'svenfuchs@artweb-design.de', 'message': 'fix unit tests', 'started_at': '2011-03-10T19: 07: 24+01: 00' } },
      'build:log':      { 'repository': { 'id': 1 }, 'build': { 'id': 9 }, 'log': '$ git clean -fdx' },
      'build:finished': { 'repository': { 'id': 1, 'name': 'svenfuchs/minimal', 'last_duration': null, 'id': 1 }, 'build': { 'id': 9, 'finished_at': '2011-03-10T19:07:47+01:00', 'status': 0 } },
    };
    _.each(events, function(data, event) {
      $('#' + event.replace(':', '_')).click(function(e) {
        e.preventDefault();
        Travis.trigger(event, _.clone(data));
      });
    });
  }
});

if (window.console) {
  // Pusher.log = function() { window.console.log.apply(window.console, arguments); }
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


