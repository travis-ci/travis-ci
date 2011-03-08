Travis.Views.Build.Build = Travis.Views.Base.Show.extend({
  initialize: function(args) {
    _.bindAll(this, 'buildChanged', 'buildLogged', 'updateTab', 'updateSummary', 'updateLog', 'updateMatrix');

    this.selectors = _.extend({
      element: '#tab_build div'
    }, this.selectors || {});

    this.templates = _.extend({
      show: args.templates['builds/show'],
      summary: args.templates['builds/_summary'],
      matrix: args.templates['builds/_matrix']
    }, this.templates || {});

    this.model_events = _.extend({
      change: 'buildChanged',
      log: 'buildLogged'
    }, this.model_events || {});

    Travis.Views.Base.Show.prototype.initialize.apply(this, arguments);
  },
  connect: function(build) {
    Travis.Views.Base.Show.prototype.connect.apply(this, arguments);
    this.updateSummary(build);
    build.matrix ? this.renderMatrix(build) : this.updateLog(build);
    this.element().updateTimes();
    this.element().activateTab('Build');
  },
  buildChanged: function(build) {
    this.updateSummary(build);
    this.updateMatrix(build);
  },
  buildLogged: function(build, chars) {
    var element = $('.log', this.element());
    element.append(chars);
    element.deansi();
  },
  updateTab: function(build) {
    var href = '#!/' + build.repository().get('name') + '/builds/' + build.id;
    var title = 'Build #' + build.get('number');
    $('h5 a', this.element().closest('li')).attr('href', href).html(title);
  },
  updateSummary: function(build) {
    $('.summary', this.element()).replaceWith(this.templates.summary(build.toJSON()));
  },
  updateLog: function(build) {
    var element = $('.log', this.element());
    element.show();
    element.html(build.get('log'));
    element.deansi();
  },
  renderMatrix: function(build) {
    $('.matrix', this.element()).replaceWith(this.templates.matrix({ dimensions: build.matrix.dimensions(), builds: build.matrix.toJSON() }));
  },
  updateMatrix: function(build) {
  }
});
