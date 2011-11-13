Travis.Controllers.Builds.Show = SC.Object.extend({
  parent: null,
  buildBinding: 'parent.build',
  repositoryBinding: 'parent.repository',

  init: function() {
    SC.run.later(this.updateTimes.bind(this), Travis.UPDATE_TIMES_INTERVAL);
    var self = this;

    this.view = Travis.View.create({
      controller: this,
      repositoryBinding: 'controller.repository',
      buildBinding: 'controller.build',
      matrixBinding: 'controller.matrix',
      templateName: 'app/templates/builds/show',
      didInsertElement: function() {
        this._super.apply(this, arguments);

        if (self.parent.params.line_number) {
          setTimeout(function() {
            var line_element = $("a[name='" + self.parent.params.line_number + "']")
            if(line_element.length > 0) {
              // TODO: FIXME:
              // Warning: this is quite a dirty implementation for line numbers. The problem with SC is
              // that didInsertElement all all the post-render callbacks don't really do what we require,
              // they are called before we've got information from server, which is absolutely incorrect.
              // Especially taken into consideration that most interest for that feature are when the
              // page is loaded.
              //
              // Other than the pageload, element IDs make hashtags/anchors to get handled auto-magically.
              $(window).scrollTop(line_element.offset().top)
              line_element.addClass("highlight")
            }
          }, 1000);
        }
      }
    });

    this.set('matrix', SC.ArrayProxy.create({ parent: this, contentBinding: 'parent.build.matrix' }));
  },
  // build: function() {
  //   var build = this.getPath('parent.build');
  //   if(build && build.getPath('matrix.length') == 1) {
  //     console.log('switching the build in Controllers.Builds.Show');
  //     build = build.get('matrix').objectAt(0);
  //   }
  //   return build;
  // }.property('parent.build.id').cacheable(),

  destroy: function() {
    this.view.$().remove();
    this.view.destroy();
  },

  updateTimes: function() {
    var build  = this.get('build');
    if(build) build.updateTimes();

    var matrix = this.getPath('build.matrix');
    if(matrix) $.each(matrix.toArray(), function(ix, build) { build.updateTimes() }.bind(this));

    SC.run.later(this.updateTimes.bind(this), Travis.UPDATE_TIMES_INTERVAL);
  }
});
