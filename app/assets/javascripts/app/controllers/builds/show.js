Travis.Controllers.Builds.Show = Ember.Object.extend({
  buildBinding: 'parent.build',
  repositoryBinding: 'parent.repository',

  init: function() {
    this._super();
    Ember.run.later(this.updateTimes.bind(this), Travis.UPDATE_TIMES_INTERVAL);
    var self = this;

    this.view = Ember.View.create({
      controller: this,
      repositoryBinding: 'controller.repository',
      contentBinding: 'controller.build',
      jobsBinding: 'controller.jobs',
      branchesBinding: 'controller.branches',
      templateName: 'app/templates/builds/show'
    });
  },

  buildDidChange: function() {
    var build = this.get('build');

    //this stops jobs from subscribing?

    if (build && build.get('isLoaded')) {
      this.subscribeToFirstJob();
    } else {
      if (!build) { return; }
      build.addObserver('isLoaded', this, 'subscribeToFirstJob');
    }
  }.observes('build'),

  subscribeToFirstJob: function() {
    var build = this.get('build'),
        matrix = build.get('matrix'),
        length = matrix.get('length');
    if (build.get('isLoaded')) {
      build.removeObserver('isLoaded', this, 'subscribeToFirstJob');

      if (length > 1) {
        return true;
      } else if (length === 1) {
        this.subscribeToFirstJobWhenMatrixReady();
      } else {
        matrix.addObserver('length', this, 'subscribeToFirstJobWhenMatrixReady');
      }
    }
  },

  subscribeToFirstJobWhenMatrixReady: function() {
    var matrix = this.getPath('build.matrix'), job;
    matrix.removeObserver('length', this, 'subscribeToFirstJobWhenMatrixReady');
    if (matrix.get('length') === 1) {
      job = matrix.objectAt(0);
      if (job && job.get('isReady') && (job.get('state') != 'finished')) {
        job.subscribe();
      }
    }
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
    if(matrix) $.each(matrix.toArray(), function(ix, job) { job.updateTimes(); }.bind(this));

    Ember.run.later(this.updateTimes.bind(this), Travis.UPDATE_TIMES_INTERVAL);
  },

  _buildObserver: function() {
    if(this.getPath('build.isReady') && this.getPath('build.matrix.length') === 0) {
      this.get('build').refresh();
    }
    if(this.getPath('build.isReady') && this.getPath('build.matrix.length') == 1 && this.getPath('build.matrix').objectAt(0).get('log') === null) {
      // TODO why does firstObject not work here?
      this.getPath('build.matrix').objectAt(0).refresh();
    }
  }.observes('build.status')
});
