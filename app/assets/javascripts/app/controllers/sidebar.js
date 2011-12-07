Travis.Controllers.Sidebar = SC.Object.extend({
  cookie: 'sidebar_minimized',

  init: function() {
    Travis.Controllers.Workers.create();
    Travis.Controllers.Jobs.create({ queue: 'builds.config'  });
    Travis.Controllers.Jobs.create({ queue: 'builds.common'  });
    Travis.Controllers.Jobs.create({ queue: 'builds.node_js' });
    Travis.Controllers.Jobs.create({ queue: 'builds.php' });
    Travis.Controllers.Jobs.create({ queue: 'builds.rails' });
    Travis.Controllers.Jobs.create({ queue: 'builds.erlang' });
    Travis.Controllers.Jobs.create({ queue: 'builds.spree' });

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
