Travis.Controllers.Repositories.BranchSummary = Ember.Object.extend({
  repositoryBinding: 'parent.repository',
     
  init: function() {
    this._super();
    this.view = Ember.View.create({
      controller: this,
      repositoryBinding: 'controller.repository',
      templateName: 'app/templates/repositories/branch_summary'
    });
  },

  destroy: function() {
    // console.log('destroying list in: ' + this.selector + ' .details')
    if(this.view) {
      this.view.$().remove();
      this.view.destroy();
    }
  }

});
