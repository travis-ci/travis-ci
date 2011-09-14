Travis.Controllers.Tabs = SC.Object.extend({
  init: function() {
    // SC.run.later(this.updateTimes.bind(this), 5000);
  },

  activate: function(tab) {
    if (this.active !== tab) {
      this.destroy();
      this.create(tab);
      SC.run.next(function() {
        this.setActive(tab);
      }.bind(this));
    }
  },

  setActive: function(tab) {
    this.active = tab;
    $('.tabs > li', this.selector).removeClass('active');
    $('#tab_' + tab, this.selector).addClass('active');
  },

  toggle: function(tab, visible) {
    $('#tab_' + tab)[visible ? 'addClass' : 'removeClass']('display');
  },

  create: function(tab) {
    if(this.tabs) {
      this.tab = this.tabs[tab].create({ parent: this.parent });
      this.tab.view.appendTo('#tab_' + tab + ' .tab');
    }
  },

  destroy: function() {
    this.tab && this.tab.view.destroy();
  },

  // updateTimes: function() {
  //   if(this.tab) {
  //     var content = this.view.get('content');
  //     if(SC.isArray(content)) {
  //       content.forEach(function(value) { value.updateTimes() });
  //     } else if(content) {
  //       content.updateTimes();
  //     }
  //   }
  //   SC.run.later(this.updateTimes.bind(this), 5000);
  // }
});




