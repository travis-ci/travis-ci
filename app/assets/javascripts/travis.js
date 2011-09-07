var Travis = SC.Application.create({
  Controllers: {}, Models: {}, Helpers: {}, Views: {},

  store: SC.Store.create().from('Travis.DataSource'),

  run: function() {
    this.initControllers();
    this.initRoutes();
    this.initEvents();
  },

  initRoutes: function() {
    SC.routes.add('!/:owner/:name/builds/:id', function(params) { Travis.main.activate('build',   params) });
    SC.routes.add('!/:owner/:name/builds',     function(params) { Travis.main.activate('history', params) });
    SC.routes.add('!/:owner/:name',            function(params) { Travis.main.activate('current', params) });
    SC.routes.add('',                          function(params) { Travis.main.activate('current', params) });
  },

  initControllers: function() {
    this.main = Travis.Controllers.Repository.create();
    Travis.Controllers.Repositories.create();
    Travis.Controllers.Workers.create();
    Travis.Controllers.Jobs.create({ queue: 'builds' });
    Travis.Controllers.Jobs.create({ queue: 'rails' });
  },

  initEvents: function() {
    $('.tool-tip').tipsy({ gravity: 'n', fade: true });
    $('.fold').live('click', function() { $(this).hasClass('open') ? $(this).removeClass('open') : $(this).addClass('open'); })

    $('#top .profile').mouseover(function() { $('#top .profile ul').show(); });
    $('#top .profile').mouseout(function() { $('#top .profile ul').hide(); });
  },

  // receive: function(event, data) {
  //   var build = data.build;
  //   if(build) {
  //     if(build.status) build.result = build.status; // setting build status doesn't trigger bindings
  //     Travis.Build.update(build.id, build);
  //     SC.RunLoop.end()
  //   }
  // }
});

$('document').ready(function() {
  if(window.env !== undefined && window.env !== 'jasmine') Travis.run();
  // Travis.receive('foo', { build: { id: 8, startedAt: '2011-05-23T00:00:00Z', finishedAt: '2011-05-23T00:00:20Z' } })
});

