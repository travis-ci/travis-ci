Travis.Controllers.Tabs = SC.Object.extend({
  TABS: {
    'current': { templateName: 'app/templates/builds/show', buildBinding:  'Travis.main.repository.lastBuild' },
    'history': { templateName: 'app/templates/builds/list', buildsBinding: 'Travis.main.repository.builds' },
    'build':   { templateName: 'app/templates/builds/show', buildBinding:  'Travis.main.build' },
  },

  activate: function(tab) {
    this.destroy();
    this.set('active', this.create(tab));
    this.toggle(tab);
  },

  toggle: function(tab) {
    SC.run.next(function() {
      $('#repository .tabs > li').removeClass('active');
      $('#repository #tab_' + tab).addClass('active');
    });
  },

  create: function(name) {
    return SC.View.create(this.TABS[name]).appendTo('#tab_' + name + ' .tab');
  },

  destroy: function() {
    this.get('active') && this.get('active').destroy();
  },
});
