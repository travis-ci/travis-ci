Travis.Controllers.Builds.Show = SC.Object.extend({
  parent: null,
  repositoryBinding: 'parent.repository',
  buildBinding: 'parent.build',

  init: function() {
    SC.run.later(this.updateTimes.bind(this), Travis.UPDATE_TIMES_INTERVAL);

    this.view = Travis.View.create({
      controller: this,
      repositoryBinding: 'controller.repository',
      buildBinding: 'controller.build',
      matrixBinding: 'controller.matrix',
      templateName: 'app/templates/builds/show'
    });

    this.set('matrix', SC.ArrayProxy.create({ parent: this, contentBinding: 'parent.build.matrix' }));
  },

  destroy: function() {
    this.view.$().remove();
    this.view.destroy();
  },

  updateTimes: function() {
    var build  = this.get('build');
    if(build) build.updateTimes();

    var matrix = this.getPath('build.matrix');
    if(matrix) $.each(matrix.toArray(), function(ix, build) { build.updateTimes() }.bind(this));

    SC.run.later(this.updateTimes.bind(this), Travis.UPDATE_TIMES_INTERVAL);
  }
});
