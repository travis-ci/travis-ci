Travis.Controllers.Builds.List = Ember.ArrayController.extend({
  parent: null,
  repositoryBinding: 'parent.repository',
  defaultContentBinding: 'parent.repository.builds',
  content: Ember.A(),

  init: function() {
    this._super();
    Ember.run.later(this.updateTimes.bind(this), Travis.UPDATE_TIMES_INTERVAL);

    this.view = Ember.View.create({
      builds: this,
      repositoryBinding: 'builds.repository',
      templateName: 'app/templates/builds/list'
    });

    this.propertyDidChange('defaultContent');
  },

  defaultContentDidChange: function() {
    var content = this.get('defaultContent');
    if (content && (content.get('status') & SC.Record.READY) && this.getPath('content.length') === 0) {
      this.get('content').pushObjects(content.toArray());
    }
  }.observes('defaultContent.status'),

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
    Ember.run.later(this.updateTimes.bind(this), Travis.UPDATE_TIMES_INTERVAL);
  },

  showMore: function() {
    var content = this.get('content'),
      moreContent = Travis.Build.byRepositoryId(9),
      moreContentDidLoad = function() {
      if (moreContent.get('status') & SC.Record.READY) {
        moreContent.removeObserver('status', this, moreContentDidLoad);
        content.pushObjects(moreContent.toArray());
      }
    };
    moreContent.addObserver('status', this, moreContentDidLoad);
    moreContent.propertyDidChange('status');
  }
});
