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
    SC.routes.add('!/:owner/:name/builds/:id', function(params) { Travis.main.activate('build',   params) });
    SC.routes.add('!/:owner/:name/builds',     function(params) { Travis.main.activate('history', params) });
    SC.routes.add('!/:owner/:name',            function(params) { Travis.main.activate('current', params) });
    SC.routes.add('',                          function(params) { Travis.main.activate('current', params) });

    this.main   = Travis.Controllers.Repository.create();
    this.events = Travis.Controllers.Events.create();

    Travis.Controllers.Repositories.create();
    Travis.Controllers.Workers.create();
    Travis.Controllers.Jobs.create({ queue: 'builds' });
    Travis.Controllers.Jobs.create({ queue: 'rails' });
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
  },

  receive: function(event, data) {
    this.events.receive(event, data);
  }
});

$('document').ready(function() {
  if(window.env !== undefined && window.env !== 'jasmine') Travis.run();
  // Travis.receive('foo', { build: { id: 8, startedAt: '2011-05-23T00:00:00Z', finishedAt: '2011-05-23T00:00:20Z' } })
});

$.ajaxSetup({
  beforeSend: function(xhr) {
    xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
  }
});

Pusher.log = function(message) {
  if (window.console && window.console.log) window.console.log(message);
};
