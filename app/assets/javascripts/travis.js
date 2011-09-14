// __DEBUG__ = true;
// SC.LOG_BINDINGS = true;

var Travis = SC.Application.create({
  Controllers: {}, Models: {}, Helpers: {}, Views: {},

  store: SC.Store.create().from('Travis.DataSource'),

  run: function() {
    var action = $('body').attr('id') == 'home' ? 'initMain' : 'initProfile';
    this[action]();

    this.initPusher();
    this.initEvents();
  },

  initMain: function() {
    this.dispatch = Travis.Controllers.Events.create();
    this.main = Travis.Controllers.Repository.create();
    this.home = Travis.Controllers.Home.create();

    Travis.Controllers.Repositories.create();
    Travis.Controllers.Workers.create();
    Travis.Controllers.Jobs.create({ queue: 'builds' });
    Travis.Controllers.Jobs.create({ queue: 'rails' });
    Travis.Controllers.Sidebar.create();

    SC.routes.add('!/:owner/:name/builds/:id', function(params) { Travis.main.activate('build',   params) });
    SC.routes.add('!/:owner/:name/builds',     function(params) { Travis.main.activate('history', params) });
    SC.routes.add('!/:owner/:name',            function(params) { Travis.main.activate('current', params) });
    SC.routes.add('',                          function(params) { Travis.home.activate(params) });
  },

  initProfile: function() {
    Travis.Controllers.ServiceHooks.create();
  },

  initPusher: function() {
    var channels = ['repositories', 'jobs'];
    $.each(channels, function(ix, channel) { pusher.subscribe(channel).bind_all(Travis.receive); })
  },

  initEvents: function() {
    $('.tool-tip').tipsy({ gravity: 'n', fade: true });
    $('.fold').live('click', function() { $(this).hasClass('open') ? $(this).removeClass('open') : $(this).addClass('open'); })

    $('#top .profile').mouseover(function() { $('#top .profile ul').show(); });
    $('#top .profile').mouseout(function() { $('#top .profile ul').hide(); });

    $('#workers .group').live('click', function() { $(this).hasClass('open') ? $(this).removeClass('open') : $(this).addClass('open'); })
  },

  receive: function(event, data) {
    Travis.dispatch.receive(event, data);
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
