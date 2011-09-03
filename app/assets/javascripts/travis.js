var Travis = SC.Application.create({
  Controllers: {}, Models: {}, Helpers: {}, Views: {},

  store: SC.Store.create().from('Travis.DataSource'),
  run: function() {
    // $.extend(SC.TEMPLATES, Utils.loadTemplates(SC.Handlebars.compile));

    // SC.routes.add('!/:owner/:repository/builds/:id', function(params) { Travis.controllers.repository.load($.extend(params, { tab: 'build'   })) });
    // SC.routes.add('!/:owner/:repository/builds',     function(params) { Travis.controllers.repository.load($.extend(params, { tab: 'builds'  })) });
    // SC.routes.add('!/:owner/:repository',            function(params) { Travis.controllers.repository.load($.extend(params, { tab: 'current' })) });
    // SC.routes.add('',                                function(params) { Travis.controllers.repository.load($.extend(params, { tab: 'current' })) });

    // Travis.mainPane = SC.TemplatePane.append({
    //   layerId: 'travis',
    //   templateName: 'travis'
    // });

    // Travis.controllers.repositories.load();
    // Travis.controllers.workers.load();
    // Travis.controllers.jobs.load();

    // // TODO: This registers an interval that updates the DOM.
    // // We should update this to just invalidate SproutCore properties so the
    // // DOM updates automatically.
    // // Utils.updateTimes();

    // $('.tool-tip').tipsy({ gravity: 'n', fade: true });
    // $('.fold').live('click', function() { $(this).hasClass('open') ? $(this).removeClass('open') : $(this).addClass('open'); })

    // $('#top .profile').mouseover(function() { $('#top .profile ul').show(); });
    // $('#top .profile').mouseout(function() { $('#top .profile ul').hide(); });
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

// SC.ready(function() {
  if(typeof Jasmine !== undefined) Travis.run();
  // Travis.receive('foo', { build: { id: 8, startedAt: '2011-05-23T00:00:00Z', finishedAt: '2011-05-23T00:00:20Z' } })
// });

Travis.controllers = SC.Object.create({
  repositories: SC.ArrayController.create({
    load: function() {
      this.set('content', Travis.Repository.latest());
    }
  })
});


// mostly stolen from http://svarovsky-tomas.com/sproutcore-datasource.html, thanks Tomáš!




// Travis.store = SC.Store.create().from('Travis.DataSource');
// Travis.controllers.repositories.load();
