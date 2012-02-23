// __DEBUG__ = true;
// Ember.LOG_BINDINGS = true;

var Travis = Ember.Application.create({
  Controllers: { Repositories: {}, Builds: {}, Jobs: {}, Branches: {} }, Models: {}, Helpers: {}, Views: {},

  UPDATE_TIMES_INTERVAL: 5000,

  store: Ember.Store.create().from('Travis.DataSource'),
  channels: [],

  run: function() {
    var action = $('body').attr('id');
    if(this[action]) {
      this[action]();
    }
    this.initPusher();
    this.initEvents();
    $.facebox.settings.closeImage = '/images/facebox/closelabel.png';
    $.facebox.settings.loadingImage = '/images/facebox/loading.gif'; 
  },

  home: function() {
    this.events = Travis.Controllers.Events.create();
    this.main   = Travis.Controllers.Repositories.Show.create();
    this.left   = Travis.Controllers.Repositories.List.create();
    this.right  = Travis.Controllers.Sidebar.create();

    Ember.routes.add('!/:owner/:name/jobs/:id/:line_number', function(params) { Travis.main.activate('job', params) });
    Ember.routes.add('!/:owner/:name/jobs/:id',   function(params) { Travis.main.activate('job',     params) });
    Ember.routes.add('!/:owner/:name/builds/:id', function(params) { Travis.main.activate('build',   params) });
    Ember.routes.add('!/:owner/:name/builds',     function(params) { Travis.main.activate('history', params) });
    Ember.routes.add('!/:owner/:name/branches',   function(params) { Travis.main.activate('branches', params) });
    Ember.routes.add('!/:owner/:name',            function(params) { Travis.main.activate('current', params) });
    Ember.routes.add('',                          function(params) { Travis.main.activate('current', params) });
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
      if(window.pusher) pusher.unsubscribe(channel);
    }
  },

  initPusher: function() {
    if(window.pusher) {
      var channels = ['common'];
      $.each(channels, function(ix, channel) { this.subscribe(channel); }.bind(this))
    }
  },

  initEvents: function() {
    $('.tool-tip').tipsy({ gravity: 'n', fade: true });
    $('.fold').live('click', function() { $(this).toggleClass('open'); });

    $('#top .profile').mouseover(function() { $('#top .profile ul').show(); });
    $('#top .profile').mouseout(function() { $('#top .profile ul').hide(); });

    $('#workers .group').live('click', function() { $(this).toggleClass('open'); })

    $('li#tab_recent').click(function () {
      Travis.left.recent();
    });
    $('li#tab_my_repositories').click(function() {
      Travis.left.owned_by($(this).data('github-id'));
    });
    $('li#tab_search').click(function () {
      Travis.left.search();
    });

    $('.repository').live('mouseover', function() {
      $(this).find('.description').show();
    });

    $('.repository').live('mouseout', function() {
      $(this).find('.description').hide();
    });

    $('.tools').live('click', function() {
      $(this).find('.content').toggle();
    }).find('.content').live('click', function(event){
      event.stopPropagation();
    }).find('input[type=text]').live('focus', function() {
      this.select();
    }).live('mouseup', function(e) {
      e.preventDefault();
    });

    $('html').click(function(e) {
      if ($(e.target).closest('.tools .content').length == 0 && $('.tools .content').css('display') != 'none') {
        $('.tools .content').fadeOut('fast');
      }
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
