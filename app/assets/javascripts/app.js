// __DEBUG__ = true;
// SC.LOG_BINDINGS = true;

var Travis = SC.Application.create({
  Controllers: { Repositories: {}, Builds: {} }, Models: {}, Helpers: {}, Views: {},

  UPDATE_TIMES_INTERVAL: 5000,

  store: SC.Store.create().from('Travis.DataSource'),
  channels: [],

  run: function() {
    var action = $('body').attr('id');
    if(this[action]) {
      this[action]();
    }
    this.initPusher();
    this.initEvents();
  },

  home: function() {
    this.events = Travis.Controllers.Events.create();
    this.main   = Travis.Controllers.Repositories.Show.create();
    this.left   = Travis.Controllers.Repositories.List.create();
    this.right  = Travis.Controllers.Sidebar.create();

    SC.routes.add('!/:owner/:name/builds/:id/:line_number', function(params) { Travis.main.activate('build',   params) });
    SC.routes.add('!/:owner/:name/builds/:id', function(params) { Travis.main.activate('build',   params) });
    SC.routes.add('!/:owner/:name/builds',     function(params) { Travis.main.activate('history', params) });
    SC.routes.add('!/:owner/:name',            function(params) { Travis.main.activate('current', params) });
    SC.routes.add('',                          function(params) { Travis.main.activate('current', params) });
  },

  profile: function() {
    Travis.Controllers.ServiceHooks.create();
  },

  receive: function(event, data) {
    Travis.events.receive(event, data);
  },

  subscribe: function(channel) {
    if(this.channels.indexOf(channel) == -1) {
      this.channels.push(channel);
      if(window.pusher) pusher.subscribe(channel).bind_all(this.receive);
    }
  },

  unsubscribe: function(channel) {
    var ix = this.channels.indexOf(channel);
    if(ix == -1) {
      this.channels.splice(ix, 1);
      if(window.pusher)pusher.unsubscribe(channel);
    }
  },

  initPusher: function() {
    if(window.pusher) {
      var channels = ['builds', 'jobs', 'workers'];
      $.each(channels, function(ix, channel) { this.subscribe(channel); }.bind(this))
    }
  },

  initEvents: function() {
    $('.tool-tip').tipsy({ gravity: 'n', fade: true });
    $('.fold').live('click', function() { $(this).hasClass('open') ? $(this).removeClass('open') : $(this).addClass('open'); });

    $('#top .profile').mouseover(function() { $('#top .profile ul').show(); });
    $('#top .profile').mouseout(function() { $('#top .profile ul').hide(); });

    $('#workers .group').live('click', function() { $(this).hasClass('open') ? $(this).removeClass('open') : $(this).addClass('open'); })

    $('li#tab_recent').click(function () {
      Travis.left.recent();
    });
    $('li#tab_my_repositories').click(function() {
      Travis.left.owned_by($(this).data('github-id'));
    });
    $('li#tab_search').click(function () {
      Travis.left.search();
    });
  },

  startLoading: function() {
    $("#main").addClass("loading");
  },

  stopLoading: function() {
    $("#main").removeClass("loading");
  }
});

$('document').ready(function() {
  if(window.env !== undefined && window.env !== 'jasmine') Travis.run();
});

$.ajaxSetup({
  beforeSend: function(xhr) {
    xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
  }
});

if (window.console && window.console.log) {
  // Pusher.log = function(message) { window.console.log(arguments); };
}
