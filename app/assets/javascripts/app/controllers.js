// SC.LOG_BINDINGS = true;

Travis.Controllers = {
  repositories: SC.ArrayController.create({
    load: function() {
      this.set('content', Travis.Repository.latest());
    }
  }),

  repository: SC.Object.create({
    load: function(tab, params) {
      this.set('tab', tab);
      this.set('params', params);
    },

    contentBinding: 'repositories.firstObject',

    repositories: function(params) {
      if(!this.get('tab')) return;
      var slug = $.compact([this.getPath('params.owner'), this.getPath('params.name')]).join('/');
      return slug.length > 0 ? Travis.Repository.bySlug(slug) : Travis.Repository.latest();
    }.property('params'),
  }),

  // tabs: SC.Object.create({
  //   current: SC.Object.create({
  //     summaryCssClasses: function() {
  //       return $.compact(['summary', 'clearfix', this.getPath('build.color')]).join(' ');
  //     }.property('build')
  //   }),

  //   builds: SC.Object.create({
  //   })
  // })
};
