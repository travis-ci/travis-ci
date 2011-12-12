Travis.Controllers.Tabs = SC.Object.extend({
  activate: function(tab) {
    if (this.get('active') !== tab) {
      this.destroy();
      SC.run.next(function() {
        this.create(tab);
        this.setActive(tab);
      }.bind(this));
    }
  },

  setActive: function(tab) {
    this.set('active', tab);
    $('.tabs > li', this.selector).removeClass('active');
    $('#tab_' + tab, this.selector).addClass('active');
  },

  toggle: function(tab, visible) {
    $('#tab_' + tab)[visible ? 'addClass' : 'removeClass']('display');
  },

  create: function(tab) {
    if(this.tabs) {
      this.tab = this.tabs[tab].create({ parent: this.parent, selector: '#tab_' + tab + ' .tab' });
      this.tab.view.appendTo('#tab_' + tab + ' .tab');
    }
  },

  destroy: function() {
    this.tab && this.tab.destroy();
    delete this.tab;
  },

  _activeObserver: function() {
    var active = this.get('active')
    if (active == 'job')   this.toggle('build', true);
  }.observes('active'),
});
