Travis.Controllers.Sidebar = Ember.Object.extend({
  cookie: 'sidebar_minimized',
  queues: [
    { name: 'common',  display: 'Common' },
    { name: 'php',     display: 'PHP, Perl and Python' },
    { name: 'node_js', display: 'Node.js' },
    { name: 'jvmotp',  display: 'JVM and Erlang' },
    { name: 'rails',   display: 'Rails' },
    { name: 'spree',   display: 'Spree' },
  ],

  init: function() {
    this._super();
    Travis.Controllers.Workers.create();
    $.each(this.queues, function(ix, queue) {
      Travis.Controllers.Queue.create({ queue: 'builds.' + queue.name, display: queue.display });
    });

    $(".slider").click(function() { this.toggle(); }.bind(this));
    if($.cookie(this.cookie) === 'true') { this.minimize(); }
    this.persist();
  },

  toggle: function() {
    this.isMinimized() ? this.maximize() : this.minimize();
    this.persist();
  },

  isMinimized: function() {
    return $('#right').hasClass('minimized');
  },

  minimize: function() {
    $('#right').addClass('minimized');
    $('#main').addClass('maximized');
  },

  maximize: function() {
    $('#right').removeClass('minimized');
    $('#main').removeClass('maximized');
  },

  persist: function() {
    $.cookie(this.cookie, this.isMinimized());
  }
});
