Travis.Controllers.Sidebar = SC.Object.extend({
  cookie: 'sidebar_minimized',
  queues: ['common', 'node_js', 'php', 'rails', 'erlang', 'spree'], // 'configure',

  init: function() {
    Travis.Controllers.Workers.create();
    $.each(this.queues, function(ix, queue) {
      Travis.Controllers.Queue.create({ queue: 'builds.' + queue });
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
