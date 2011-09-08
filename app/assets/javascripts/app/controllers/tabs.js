Travis.Controllers.Tabs = SC.Object.extend({
  TABS: {
    'current': { templateName: 'app/templates/builds/show', buildBinding:  'controller.repository.lastBuild' },
    'history': { templateName: 'app/templates/builds/list', buildsBinding: 'controller.repository.builds' },
    'build':   { templateName: 'app/templates/builds/show', buildBinding:  'controller.build' },
  },

  active: 'current',

  activate: function(tab) {
    this.set('active', tab);
    this.destroy();
    this.view = this.create(tab).appendTo('#tab_' + tab + ' .tab');
    this.setVisible(tab);
  },

  setVisible: function(tab) {
    SC.run.next(function() {
      $('#repository .tabs > li').removeClass('active');
      $('#repository #tab_' + tab).addClass('active');
    });
  },

  toggleParentTab: function(visible) {
    $('#tab_parent')[visible ? 'addClass' : 'removeClass']('display');
  },

  create: function(name) {
    return SC.View.create($.extend({ controller: this.get('controller') }, this.TABS[name]));
  },

  destroy: function() {
    this.view && this.view.destroy();
  },
});
