Travis.Controllers.Jobs.Show = Ember.Object.extend({
  jobBinding: 'parent.job',
  repositoryBinding: 'parent.repository',

  init: function() {
    this._super();
    Ember.run.later(this.updateTimes.bind(this), Travis.UPDATE_TIMES_INTERVAL);
    var self = this;

    this.view = Ember.View.create({
      controller: this,
      repositoryBinding: 'controller.repository',
      contentBinding: 'controller.job',
      templateName: 'app/templates/jobs/show',
      didInsertElement: function() {
        this._super.apply(this, arguments);

        if (self.parent.params.line_number) {
          setTimeout(function() {
            var line_element = $("a[name='" + self.parent.params.line_number + "']");
            if(line_element.length > 0) {
              // TODO: FIXME:
              // Warning: this is quite a dirty implementation for line numbers. The problem with SC is
              // that didInsertElement all all the post-render callbacks don't really do what we require,
              // they are called before we've got information from server, which is absolutely incorrect.
              // Especially taken into consideration that most interest for that feature are when the
              // page is loaded.
              //
              // Other than the pageload, element IDs make hashtags/anchors to get handled auto-magically.
              $(window).scrollTop(line_element.offset().top);
              line_element.addClass("highlight");
            }
          }, 1000);
        }
      }
    });
  },

  destroy: function() {
    if(this.view) {
      this.view.$().remove();
      this.view.destroy();
    }
  },

  updateTimes: function() {
    var build  = this.get('build');
    if(build) build.updateTimes();
    Ember.run.later(this.updateTimes.bind(this), Travis.UPDATE_TIMES_INTERVAL);
  },

  _jobRefresher: function() {
    if((this.getPath('job.status') & Ember.Record.READY) && (this.getPath('job.log') === null)) {
      this.get('job').refresh();
    }
  }.observes('job.status'),

  _jobSubscriber: function() {
    if((this.getPath('job.status') & Ember.Record.READY) && (this.getPath('job.state') != 'finished')) {
      this.get('job').subscribe();
    }
  }.observes('job.status')
});

