Travis.Controllers.Builds.Show = SC.Object.extend({
  buildBinding: 'parent.build',
  repositoryBinding: 'parent.repository',

  init: function() {
    SC.run.later(this.updateTimes.bind(this), Travis.UPDATE_TIMES_INTERVAL);
    var self = this;

    this.view = Travis.View.create({
      controller: this,
      repositoryBinding: 'controller.repository',
      contentBinding: 'controller.build',
      jobsBinding: 'controller.jobs',
      templateName: 'app/templates/builds/show',
    });
  },

  destroy: function() {
    if(this.view) {
      this.view.$().remove();
      this.view.destroy();
    }
  },

  updateTimes: function() {
    var build  = this.get('build');
    if(build) build.updateTimes();

    var matrix = this.getPath('build.matrix');
    if(matrix) $.each(matrix.toArray(), function(ix, job) { job.updateTimes() }.bind(this));

    SC.run.later(this.updateTimes.bind(this), Travis.UPDATE_TIMES_INTERVAL);
  },

  _buildObserver: function() {
    if(this.getPath('build.isReady') && this.getPath('build.matrix.length') == 0) {
      this.get('build').refresh();
    }
    if(this.getPath('build.isReady') && this.getPath('build.matrix.length') == 1 && this.getPath('build.matrix').objectAt(0).get('log') === null) {
      // TODO why does firstObject not work here?
      this.getPath('build.matrix').objectAt(0).refresh();
    }
  }.observes('build.status')
});
