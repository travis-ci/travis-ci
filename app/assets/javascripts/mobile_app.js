var Travis = Ember.Application.create({
  Controllers: { Repositories: {}, Builds: {}, Jobs: {} }, Models: {}, Helpers: {}, Views: {},

  store: Ember.Store.create().from('Travis.DataSource'),

  run: function() {
    var action = $('body').attr('id');
    if (this[action]) {
      this[action]();
    }
  },

  home: function() {
    this.main = Travis.Controllers.PageManager.create({
      selector: '#main',
      pages: {
        list: Travis.Controllers.Repositories.List,
        builds: Travis.Controllers.Builds.List,
        build: Travis.Controllers.Builds.Show,
        job: Travis.Controllers.Jobs.Show
      }
    });

    Ember.routes.add('!/:owner/:name/jobs/:id',   function(params) { Travis.main.activate('job',    params) });
    Ember.routes.add('!/:owner/:name/builds/:id', function(params) { Travis.main.activate('build',  params) });
    Ember.routes.add('!/:owner/:name/builds',     function(params) { Travis.main.activate('builds', params) });
    Ember.routes.add('!/:owner/:name',            function(params) { Travis.main.activate('builds', params) });
    Ember.routes.add('',                          function(params) { Travis.main.activate('list',   params) });

  },

  startLoading: function() {
  },

  stopLoading: function() {
  }
});

$('document').ready(function() {
  Travis.run();
});

$.ajaxSetup({
  beforeSend: function(xhr) {
    xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
  }
});

if (window.console && window.console.log) {
  // Pusher.log = function(message) { window.console.log(arguments); };
}
