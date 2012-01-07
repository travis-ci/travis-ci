Travis.Controllers.Builds.List = Ember.ArrayController.extend({
  parent: null,
  repositoryBinding: 'parent.repository',
  contentBinding: 'parent.repository.builds',

  init: function() {
    this._super();
    Ember.run.later(this.updateTimes.bind(this), Travis.UPDATE_TIMES_INTERVAL);

    this.view = Ember.View.create({
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
    var builds  = this.get('builds');
    if(builds) {
      $.each(builds, function(ix, build) { build.updateTimes(); }.bind(this));
    }
    Ember.run.later(this.updateTimes.bind(this), Travis.UPDATE_TIMES_INTERVAL);
  },

  showMore: function() {
    var id = this.getPath('repository.id'),
      number = this.getPath('content.lastObject.number');
    Travis.Build.olderThanNumber(id, number);
  },

  showMoreIsVisibleBinding: Em.Binding.oneWay('content.lastObject.number').transform(function(value) {
    return value > 1;
  }),
});
