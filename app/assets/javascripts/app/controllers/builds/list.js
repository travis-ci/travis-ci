Travis.Controllers.Builds.List = SC.ArrayController.extend({
  parent: null,
  repositoryBinding: 'parent.repository',
  contentBinding: 'parent.repository.builds',

  init: function() {
    SC.run.later(this.updateTimes.bind(this), Travis.UPDATE_TIMES_INTERVAL);

    this.view = Travis.View.create({
      builds: this,
      repositoryBinding: 'builds.repository',
      templateName: 'app/templates/builds/list'
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
    var builds  = this.get('builds');
    if(builds) {
      $.each(builds, function(ix, build) { build.updateTimes(); }.bind(this));
    }
    SC.run.later(this.updateTimes.bind(this), Travis.UPDATE_TIMES_INTERVAL);
  }
});
