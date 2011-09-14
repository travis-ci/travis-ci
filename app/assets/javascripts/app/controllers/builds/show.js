Travis.Controllers.Builds.Show = SC.Object.extend({
  parent: null,
  repositoryBinding: 'parent.repository',
  buildBinding: 'parent.build',

  init: function() {
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
  }
});
