var Travis = SC.Application.create({
  Controllers: {}, Models: {}, Helpers: {}, Views: {},

  store: SC.Store.create().from('Travis.DataSource'),
  run: function() {
    this.initControllers();
    this.createViews();
    this.setupRoutes();
    this.initEvents();
  },
  setupRoutes: function() {
    SC.routes.add('!/:owner/:name/builds/:id', function(params) { Travis.Controllers.repository.load('build',   params) });
    SC.routes.add('!/:owner/:name/builds',     function(params) { Travis.Controllers.repository.load('history', params) });
    SC.routes.add('!/:owner/:name',            function(params) { Travis.Controllers.repository.load('current', params) });
    SC.routes.add('',                          function(params) { Travis.Controllers.repository.load('current', params) });
  },
  createViews: function() {
    SC.View.create({ content: Travis.Controllers.repositories,  template: SC.TEMPLATES['app/templates/repositories/list'] }).appendTo('#tab_recent .tab')
    SC.View.create({ repository: Travis.Controllers.repository, template: SC.TEMPLATES['app/templates/repositories/show'] }).appendTo('#main')
  },
  initControllers: function() {
    Travis.Controllers.repositories.load();
    // Travis.controllers.workers.load();
    // Travis.controllers.jobs.load();
  },
  initEvents: function() {
    // TODO: This registers an interval that updates the DOM.
    // We should update this to just invalidate SproutCore properties so the
    // DOM updates automatically.
    // Utils.updateTimes();

    $('.tool-tip').tipsy({ gravity: 'n', fade: true });
    $('.fold').live('click', function() { $(this).hasClass('open') ? $(this).removeClass('open') : $(this).addClass('open'); })

    $('#top .profile').mouseover(function() { $('#top .profile ul').show(); });
    $('#top .profile').mouseout(function() { $('#top .profile ul').hide(); });
  }
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
  if(env != 'jasmine') Travis.run();
  // Travis.receive('foo', { build: { id: 8, startedAt: '2011-05-23T00:00:00Z', finishedAt: '2011-05-23T00:00:20Z' } })
});

