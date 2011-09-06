// SC.LOG_BINDINGS = true;

Travis.Controllers = {
  Repositories: SC.ArrayController.extend({
    init: function() {
      this.view = SC.View.create({ content: this, template: SC.TEMPLATES['app/templates/repositories/list'] }).appendTo('#tab_recent .tab');
      this.set('content', Travis.Repository.recent());
    }
  }),

  Repository: SC.Object.extend({
    init: function() {
      this.tabs = Travis.Controllers.Tabs.create({ main: this });
      this.view = SC.View.create({ controller: this, template: SC.TEMPLATES['app/templates/repositories/show'] }).appendTo('#main');
      this.set('content', Travis.Repository.recent());
    },

    activate: function(tab, params) {
      this.tabs.activate(tab);
      this.set('params', params);
    },

    contentBinding: 'repositories.firstObject',

    repositories: function() {
      var slug = $.compact([this.getPath('params.owner'), this.getPath('params.name')]).join('/');
      return slug.length > 0 ? Travis.Repository.bySlug(slug) : Travis.Repository.recent();
    }.property('params'),

    build: function() {
      if(this.getPath('params.id')) return Travis.Build.find(this.getPath('params.id'));
    }.property('params'),

    buildObserver: function() {
      this.getPath('build.parentId') ? $('#tab_parent').addClass('display') : $('#tab_parent').removeClass('display');
    }.observes('build.status'),
  }),

  Tabs: SC.Object.extend({
    TABS: {
      'current': { templateName: 'app/templates/builds/show', buildBinding:  'Travis.main.content.lastBuild' },
      'history': { templateName: 'app/templates/builds/list', buildsBinding: 'Travis.main.content.builds' },
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
  })
};
