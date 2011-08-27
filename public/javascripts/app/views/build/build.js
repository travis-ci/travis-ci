Travis.Views.Build.Build = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'attachTo', 'buildSelected', 'buildConfigured', 'updateTab');
    _.extend(this, this.options);

    this.el = $('<div></div>');
    if(this.repository) {
      this.render();
      this.attachTo(this.repository);
    }
  },
  render: function() {
    if(this.repository) this._update();
    return this;
  },
  detach: function() {
    if(this.repository) {
      this.repository.builds.unbind('select', this.buildSelected);
      delete this.repository;
      delete this.build;
    }
  },
  attachTo: function(repository) {
    this.detach();
    this.repository = repository;
    this.repository.builds.bind('select', this.buildSelected);
    this._update();
    this.updateTab();
  },
  detachFromBuild: function() {
    if(this.build) {
      this.build.unbind('configured', this.buildConfigured);
    }
  },
  attachToBuild: function(build) {
    this.build = build;
    this.detachFromBuild();
    this.build.bind('configured', this.buildConfigured);
  },
  buildSelected: function(build) {
    this.attachToBuild(build);
    this._update();
    this.updateTab();
  },
  buildConfigured: function(build) {
    this.build = build;
    this._update();
  },
  updateTab: function() {
    if(this.build) {
      $('#tab_build h5 a').attr('href', '#!/' + this.repository.get('slug') + '/builds/' + this.build.id).html('Build ' + this.build.get('number'));
      $('#tab_parent').hide();
      this.build.parent(function(parent) {
        $('#tab_parent').show().find('h5 a').attr('href', '#!/' + parent.repository.get('slug') + '/builds/' + parent.id).html('Build ' + parent.get('number'));
      });
    }
  },
  _update: function() {
    if(this.build) {
      this.el.empty();
      this._renderSummary();
      if (this.build.matrix && this.build.matrix.length > 0) {
          this._renderMatrix();
      } else {
        this._renderLog();
      }
    }
  },
  _renderSummary: function() {
    this.el.append(new Travis.Views.Build.Summary({ model: this.build, parent: this }).render().el);
  },
  _renderLog: function() {
    this.log = new Travis.Views.Build.Log({ model: this.build, parent: this })
    this.el.append(this.log.render().el);
    this.log.initializeEvents();
    this.log.activateCurrentLine();
  },
  _renderMatrix: function() {
    this.el.append(new Travis.Views.Build.Matrix.Table({ builds: this.build.matrix }).render().el);
  },
});
