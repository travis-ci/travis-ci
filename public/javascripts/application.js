var Travis = {
  Controllers: {}, Collections: {}, Helpers: {}, Models: {}, Views: { Base: {}, Build: { History: {}, Matrix: {} }, Jobs: {}, Repositories: {}, Repository: {}, Workers: {} },
  start: function() {
    Travis.templates = Util.loadTemplates();
    Backbone.history = new Backbone.History;
    Travis.app = new Travis.Controllers.Application();
    Travis.app.run();
  },
  trigger: function(event, data) {
    var repository = data.build.repository;
    repository.build = _.clone(data.build);
    delete repository.build.repository;
    if(data.log) repository.log = data.log;
    Travis.app.trigger(event, repository);
  }
};

// if(!INIT_DATA) {
//   var INIT_DATA = {};
// }

$(document).ready(function() {
  if(!window.__TESTING__ && $('#application').length == 1) {
    Travis.start();
    Backbone.history.start();

    var channels = ['repositories', 'jobs'];
    // _.map(INIT_DATA.repositories || [], function(repository) { channels.push('repository_' + repository.id); });
    _.each(channels, function(channel) { pusher.subscribe(channel).bind_all(Travis.trigger); })
  } else {
    Travis.templates = Util.loadTemplates();
  }

  $('#profile').click(function() { $('#profile_menu').toggle(); });
  $('.tool-tip').tipsy({ gravity: 'n', fade: true });

  if(env == 'development') {
    $('#jobs').after(Travis.templates['tools/events']());
    var events = {
      'build:queued':   { 'build': { 'id': 4, 'number': 46, 'repository': { 'name': 'travis-ci/travis-ci' } } },
      // 'build:started':  { 'build': { 'id': 4, 'number': 1, 'repository': { 'name': 'travis-ci/travis-ci', 'id': 3 }, 'commit': '4df463d5082448b58ea7367df6c4a9b5e059c9ca', 'author_name': 'Sven Fuchs', 'author_email': 'svenfuchs@artweb-design.de', 'committer_name': 'Sven Fuchs', 'committer_email': 'svenfuchs@artweb-design.de', 'message': 'fix unit tests', 'started_at': '2011-03-10T19: 07: 24+01: 00' } },
      'build:started':  { 'build': { 'id': 9, 'number': 4, 'repository': { 'name': 'svenfuchs/minimal', 'id': 1 }, 'commit': '4df463d5082448b58ea7367df6c4a9b5e059c9ca', 'author_name': 'Sven Fuchs', 'author_email': 'svenfuchs@artweb-design.de', 'committer_name': 'Sven Fuchs', 'committer_email': 'svenfuchs@artweb-design.de', 'message': 'fix unit tests', 'started_at': '2011-03-10T19: 07: 24+01: 00' } },
      'build:log':      { 'build': { 'id': 8, 'repository': { 'id': 2 } }, 'log': '$ git clean -fdx' },
      // 'build:log':      { 'build': { 'id': 1, 'repository': { 'id': 1 } }, 'log': '$ git clean -fdx' },
      'build:finished': { 'build': { 'id': 9, 'number': 4, 'repository': { 'name': 'svenfuchs/minimal', 'last_duration': null, 'url': 'https: //github.com/svenfuchs/minimal', 'id': 1 }, 'author_name': 'Sven Fuchs', 'author_email': 'svenfuchs@artweb-design.de', 'committer_name': 'Sven Fuchs', 'committer_email': 'svenfuchs@artweb-design.de', 'message': 'fix unit tests', 'commit': '4df463d5082448b58ea7367df6c4a9b5e059c9ca', 'committed_at': '2011-03-10T17: 18: 27Z', 'finished_at': '2011-03-10T19: 07: 47+01: 00', 'status': 0 } },
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


