Travis.Controllers.Tabs = Ember.Object.extend({
  activate: function(tab) {
    if(this.get('active') !== tab) {
      this.destroy();
      Ember.run.next(function() {
        this.create(tab);
        this.setActive(tab);
      }.bind(this));
    }
  },

  setActive: function(tab) {
    $('.tabs > li', this.selector).removeClass('active');
    $('.tabs > li', this.selector).removeClass('display');
    $('#tab_' + tab, this.selector).addClass('active');

    this.set('active', tab);
    if(tab == 'job') this.setDisplay('build', true);
  },

  setDisplay: function(tab, visible) {
    $('#tab_' + tab)[visible ? 'addClass' : 'removeClass']('display');
  },

  create: function(tab) {
    if(this.tabs) {
      this.tab = this.tabs[tab].create({ parent: this.parent, selector: '#tab_' + tab + ' .tab' });
      this.tab.view.appendTo('#tab_' + tab + ' .tab');
    }
  },

  destroy: function() {
    if(this.tab) this.tab.destroy();
    delete this.tab;
  }
});
