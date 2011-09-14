Travis.Controllers.Builds.List = SC.ArrayProxy.extend({
  parent: null,
  repositoryBinding: 'parent.repository',
  contentBinding: 'parent.repository.builds',

  init: function() {
    this.view = Travis.View.create({
      builds: this,
      repositoryBinding: 'builds.repository',
      templateName: 'app/templates/builds/list'
    })
  },

  destroy: function() {
    // console.log('destroying list in: ' + this.selector + ' .details')
    this.view.$().remove();
    this.view.destroy();
  }
});
