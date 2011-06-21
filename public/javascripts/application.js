var Travis = {
  // Namespace initialization
  Controllers: {}, Collections: {}, Helpers: {}, Models: {}, Views: { Base: {}, ServiceHooks: {}, Build: { History: {}, Matrix: {} }, Jobs: {}, Repositories: {}, Repository: {}, Workers: {} },
  start: function() {
    Travis.templates = Utils.loadTemplates();
    Backbone.history = new Backbone.History;
    Travis.app = new Travis.Controllers.Application();
    Travis.app.run();
  },
  trigger: function(event, data) {
    // console.log(data);
    data = _.clone(data)
    if(data.build.parent_id) {
      data.build = { id: data.build.parent_id, matrix: [_.clone(data.build)] };
    }
    var repository = _.extend(data.repository, { build: _.clone(data.build) });
    _.each(['id', 'number', 'status', 'started_at', 'finished_at'], function(key) {
      if(_.key(data.build, key)) repository['last_build_' + key] = data.build[key];
    });
    // console.log(event, _.clone(repository));
    Travis.app.trigger(event, repository);
  }
};

$(document).ready(function() {
  if(!window.__TESTING__ && $('#home').length == 1) {

    Travis.start();
    Backbone.history.start();

    var channels = ['repositories', 'jobs'];
    _.each(channels, function(channel) { pusher.subscribe(channel).bind_all(Travis.receive); })
  } else {
    Travis.templates = Utils.loadTemplates();
  }

  $('#top .profile').mouseover(function() { $('#top .profile ul').show(); });
  $('#top .profile').mouseout(function() { $('#top .profile ul').hide(); });

  $('.tool-tip').tipsy({ gravity: 'n', fade: true });
  $('.fold').live('click', function() { $(this).hasClass('open') ? $(this).removeClass('open') : $(this).addClass('open'); })

  if(env == 'development') {
    $('#jobs').after(Travis.templates['tools/events']());
    var events = {
      'build:queued':   { 'repository': { 'id': 3, 'slug': 'travis-ci/travis-ci' }, 'build': { 'id': 4, 'number': 46 } },
      'build:started':  { 'repository': { 'id': 1, 'slug': 'svenfuchs/minimal' }, 'build': { 'id': 9, 'number': 4, 'commit': '4df463d5082448b58ea7367df6c4a9b5e059c9ca', 'author_name': 'Sven Fuchs', 'author_email': 'svenfuchs@artweb-design.de', 'committer_name': 'Sven Fuchs', 'committer_email': 'svenfuchs@artweb-design.de', 'message': 'fix unit tests', 'started_at': '2011-03-10T19: 07: 24+01: 00' } },
      'build:log':      { 'repository': { 'id': 1 }, 'build': { 'id': 9, 'log': '$ git clean -fdx' } },
      'build:finished': { 'repository': { 'id': 1, 'slug': 'svenfuchs/minimal', 'last_duration': null, 'id': 1 }, 'build': { 'id': 9, 'finished_at': '2011-03-10T19:07:47+01:00', 'status': 0 } },
    };
    _.each(events, function(data, event) {
      $('#' + event.replace(':', '_')).click(function(e) {
        e.preventDefault();
        Travis.trigger(event, _.clone(data));
      });
    });
  }

  $('#search input').keyup(_.debounce(function(e) {
    var searchString = $(this).val();

    $.ajax({
      type: "GET",
      url: "/repositories",
      data: "search=" + searchString,
      success: function(repositories) {
        Travis.app.repositories.refresh(repositories);
      }
    });
  }, 100));
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

// jQuery(document).ready(function($){
//   $.each($('.post.link.github h3 a'), function() {
//     var post = $(this).parents(".post");
//     var url = $(this).attr('href');
//     var segments = url.split('/');
//     var repo = segments.pop();
//     var username = segments.pop();
//     $.getJSON("http://github.com/api/v2/json/repos/show/"+username+"/"+repo+"?callback=?", function(data){
//       var repo_data = data.repository;
//       if(repo_data) {
//         var watchers_link = $('<a>').addClass('watchers').attr('href', url+'/watchers').text(repo_data.watchers);
//         var forks_link = $('<a>').addClass('forks').attr('href', url+'/network').text(repo_data.forks);
//         var comment_link = post.find('.meta .comment-count');
//         comment_link.after(watchers_link);
//         comment_link.after(forks_link);
//       }
//     });
//   });
// });
//

// Overriden Backbone.methods for overriden fetch/sync methods
(function(){
  Backbone.methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read'  : 'GET'
  };
  Travis.DISPLAYED_KEYS = [ 'rvm', 'gemfile', 'env' ]
  function CSRFProtection (xhr) {
    var token = $('meta[name="csrf-token"]').attr('content');
    if (token) xhr.setRequestHeader('X-CSRF-Token', token);
  }

  if ('ajaxPrefilter' in $) {
    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { CSRFProtection(xhr); }});
  } else {
    $(document).ajaxSend(function(e, xhr, options){ if ( !options.crossDomain ) { CSRFProtection(xhr); }});
  }
})();