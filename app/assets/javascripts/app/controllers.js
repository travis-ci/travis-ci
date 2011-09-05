Travis.Controllers = {
  repositories: SC.ArrayController.create({
    // load: function() {
    //   this.set('content', Travis.Repository.latest());
    // }
  }),
  repository: SC.Object.create({
  }),
  tabs: SC.Object.create({
    current: SC.Object.create({
      summaryCssClasses: function() {
        return $.compact(['summary', 'clearfix', this.getPath('build.color')]).join(' ');
      }.property('build')
    }),
    builds: SC.Object.create({
    })
  })
};
