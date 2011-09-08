Travis.Controllers.Tabs = SC.Object.extend({
  activate: function(tab) {
    this.set('active', tab);
    this.destroy();
    this.view = this.create(tab).appendTo('#tab_' + tab + ' .tab');
    this.setVisible(tab);
  },

  setVisible: function(tab) {
    var selector = this.selector;
    SC.run.next(function() {
      $('.tabs > li', selector).removeClass('active');
      $('#tab_' + tab, selector).addClass('active');
    });
  },

  toggle: function(tab, visible) {
    $('#tab_' + tab)[visible ? 'addClass' : 'removeClass']('display');
  },

  create: function(name) {
    return SC.View.create($.extend({ controller: this.controller }, this.tabs[name]));
  },

  destroy: function() {
    this.view && this.view.destroy();
  },
});
