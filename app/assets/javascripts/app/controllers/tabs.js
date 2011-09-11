Travis.Controllers.Tabs = SC.Object.extend({
  init: function() {
    SC.run.later(this.updateTimes.bind(this), 5000);
  },

  activate: function(tab) {
    if (this.active !== tab) {
      this.destroy();
      this.create(tab);
      this.setActive(tab);
    }
  },

  setActive: function(tab) {
    this.active = tab;

    var selector = this.selector;
    SC.run.next(function() {
      $('.tabs > li', selector).removeClass('active');
      $('#tab_' + tab, selector).addClass('active');
    });
  },

  toggle: function(tab, visible) {
    $('#tab_' + tab)[visible ? 'addClass' : 'removeClass']('display');
  },

  create: function(tab) {
    this.view = SC.View.create($.extend({ controller: this.controller }, this.tabs[tab]));
    this.view.appendTo('#tab_' + tab + ' .tab');
  },

  destroy: function() {
    this.view && this.view.destroy();
  },

  updateTimes: function() {
    if(this.view) {
      var content = this.view.get('content');
      if(SC.isArray(content)) {
        content.forEach(function(value) { value.updateTimes() });
      } else if(content) {
        content.updateTimes();
      }
    }
    SC.run.later(this.updateTimes.bind(this), 5000);
  }
});
