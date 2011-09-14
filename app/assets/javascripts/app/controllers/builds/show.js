Travis.Controllers.Builds.Show = SC.Object.extend({
  parent: null,
  repositoryBinding: 'parent.repository',
  buildBinding: 'parent.build',

  init: function() {
    this.view = Travis.View.create({
      controller: this,
      repositoryBinding: 'controller.repository',
      buildBinding: 'controller.build',
      templateName: 'app/templates/builds/show'
    });
  },

  _renderMatrix: function() {
    if(!this.matrix && this._isMatrix()) {
      this.matrix = Travis.Controllers.Builds.Matrix.create({ parent: this });
    }
  }.observes('build.status'),

  _isMatrix: function() {
    var build = this.get('build');
    return build && (build.get('status') & SC.Record.READY != 0) && !build.get('parentId');
  }
});
