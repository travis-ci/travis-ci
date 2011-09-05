// SC.LOG_BINDINGS = true;

Travis.Controllers = {
  repositories: SC.ArrayController.create({
    load: function() {
      this.set('content', Travis.Repository.recent());
    }
  }),

  repository: SC.Object.create({
    load: function(tab, params) {
      this.tabs.activate(tab);
      this.set('params', params);
    },

    contentBinding: 'repositories.firstObject',

    repositories: function() {
      if(Travis.Repository === undefined) return;
      var slug = $.compact([this.getPath('params.owner'), this.getPath('params.name')]).join('/');
      return slug.length > 0 ? Travis.Repository.bySlug(slug) : Travis.Repository.recent();
    }.property('params'),

    build: function() {
      if(Travis.Repository === undefined || !this.getPath('params.id')) return;
      return Travis.Build.find(this.getPath('params.id'));
    }.property('params'),

    tabs: SC.Object.create({
      TABS: {
        'current': { templateName: 'app/templates/builds/show', buildBinding:  'Travis.Controllers.repository.content.lastBuild' },
        'history': { templateName: 'app/templates/builds/list', buildsBinding: 'Travis.Controllers.repository.content.builds' },
        'build':   { templateName: 'app/templates/builds/show', buildBinding:  'Travis.Controllers.repository.build' },
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
      }
    })
  }),
};
