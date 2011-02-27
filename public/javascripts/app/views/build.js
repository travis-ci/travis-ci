Travis.Views.Build = Travis.Views.Base.Show.extend({
  initialize: function(args) {
    _.bindAll(this, 'buildChanged', 'buildLogged', 'updateTab', 'updateSummary', 'updateLog');

    this.selectors = this.selectors || {
      element: '#tab_build div'
    };
    this.templates = this.templates || {
      show: args.templates['builds/show'],
      summary: args.templates['builds/_summary']
    };
    this.model_events = this.model_events || {
      change: 'buildChanged',
      log: 'buildLogged'
    };
    Travis.Views.Base.Show.prototype.initialize.apply(this, arguments);
  },
  connect: function(build) {
    Travis.Views.Base.Show.prototype.connect.apply(this, arguments);

    this.updateSummary(build);
    this.updateLog(build);
    this.element().activateTab('Build');
  },
  buildChanged: function(build) {
    this.updateSummary(build);
  },
  buildLogged: function(build, chars) {
    var element = $('.log', this.element());
    element.append(chars);
    element.deansi();
  },
  updateTab: function(build) {
    var href = '#!/' + build.repository().get('name') + '/' + build.id;
    var title = 'Build #' + build.get('number');
    $('h5 a', this.element().closest('li')).attr('href', href).html(title);
  },
  updateSummary: function(build) {
    $('.summary', this.element()).replaceWith(this.templates.summary(build.toJSON()));
    this.element().updateTimes();
  },
  updateLog: function(build) {
    var element = $('.log', this.element());
    element.html(build.get('log'));
    element.deansi();
  }
});
