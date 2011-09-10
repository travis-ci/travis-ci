Travis.Controllers.Sidebar = SC.Object.extend({
  cookie: 'sidebar_minimized',

  init: function() {
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
