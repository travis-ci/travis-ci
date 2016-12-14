var Travis = Ember.Application.create({
  Controllers: { Repositories: {}, Builds: {}, Jobs: {} }, Models: {}, Helpers: {}, Views: {},

  store: Ember.Store.create().from('Travis.DataSource'),

  run: function() {
    var action = $('body').attr('id');
    if (this[action]) {
      this[action]();
    }
    this.initEvents();
  },

  home: function() {
    Ember.routes.add('!/:owner/:name/jobs/:id', function(params) {
      Travis.set('params', params);
      Travis.transitionTo('#job_page');
    });

    Ember.routes.add('!/:owner/:name/builds/:id', function(params) {
      Travis.set('params', params);
      Travis.transitionTo('#jobs_list');
    });

    Ember.routes.add('!/:owner/:name', function(params) {
      Travis.set('params', params);
      Travis.transitionTo('#builds_list');
    });

    Ember.routes.add('', function(params) {
      Travis.set('params', params);
      Travis.transitionTo('#repositories_list');
    });

    // Ember.routes.add('!/:owner/:name/jobs/:id',   function(params) { Travis.main.activate('job',    params) });
    // Ember.routes.add('!/:owner/:name/builds/:id', function(params) { Travis.main.activate('build',  params) });
    // Ember.routes.add('!/:owner/:name/builds',     function(params) { Travis.main.activate('builds', params) });
    // Ember.routes.add('!/:owner/:name',            function(params) { Travis.main.activate('builds', params) });
    // Ember.routes.add('',                          function(params) { Travis.main.activate('list',   params) });

  },

  initEvents: function() {
    $('.fold').live('click', function() { $(this).toggleClass('open'); });
  },

  startLoading: function() {
  },

  stopLoading: function() {
  },

  transitionTo: function(page_selector) {
    var newPage = $(page_selector);
    var oldPage = this.get('currentPage');

    if (oldPage) {
      oldPage.removeClass('active').addClass('inactive');
    }
    newPage.removeClass('inactive').addClass('active');

    this.set('currentPage', newPage);
  }
});

$(function() {
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
