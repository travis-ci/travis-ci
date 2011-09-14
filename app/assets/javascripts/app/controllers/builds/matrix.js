Travis.Controllers.Builds.Matrix = SC.ArrayProxy.extend({
  parent: null,
  repositoryBinding: 'parent.repository',
  buildBinding:      'parent.build',
  contentBinding:    'parent.build.matrix',

  init: function() {
    this.view = Travis.View.create({
      controller: this,
      repositoryBinding: 'controller.repository',
      buildsBinding: 'controller.content',
      templateName: 'app/templates/builds/matrix'
    });
    this.view.appendTo('#details');
  }
});
