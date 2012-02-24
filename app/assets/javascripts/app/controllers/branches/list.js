Travis.Controllers.Branches.List = Ember.ArrayController.extend({
  parent: null,
  repositoryBinding: 'parent.repository',
  contentBinding: 'parent.repository.branch_summary',
     
  init: function() {
    this._super();
    Ember.run.later(this.updateTimes.bind(this), Travis.UPDATE_TIMES_INTERVAL);

    this.view = Ember.View.create({
      branches: this,
      repositoryBinding: 'builds.repository',
      templateName: 'app/templates/branches/list'
    });
  },

  destroy: function() {
    // console.log('destroying list in: ' + this.selector + ' .details')
    if(this.view) {
      this.view.$().remove();
      this.view.destroy();
    }
  },

  updateTimes: function() {
    var branches  = this.get('branches');
    if(branches) {
      $.each(branches, function(ix, branches) { branches.updateTimes(); }.bind(this));
    }
    Ember.run.later(this.updateTimes.bind(this), Travis.UPDATE_TIMES_INTERVAL);
  }


});
