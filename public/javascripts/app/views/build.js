Travis.Views.Build = Backbone.View.extend({
  initialize: function(args) {
    _.bindAll(this, 'bind', 'unbind', 'element', 'render', 'buildChanged', 'buildLogged');

    this.app = args.app;
    this.templates = {
      show:    args.app.templates['builds/show'],
      summary: args.app.templates['builds/_summary']
    }
  },
  element: function() {
    return $('#tab_build div');
  },
  bind: function(build) {
    this.build = build;
    build.bind('change', this.buildChanged);
    build.bind('log', this.buildLogged);
  },
  unbind: function() {
    if(this.build) {
      this.build.unbind('changed', this.buildChanged);
      this.build.unbind('log', this.buildLogged);
    }
  },
  render: function(build) {
    this.unbind();
    this.bind(build);

    var element = this.element();
    element.html($(this.templates.show(build.toJSON())));

    $('.log', element).deansi();
    Travis.Helpers.Util.activateTab(element, 'log');
    Travis.Helpers.Util.updateTimes(element);
  },
  buildChanged: function(build) {
    $('.summary', this.element()).replaceWith($(this.templates.summary(build.toJSON())));
    Travis.Helpers.Util.updateTimes();
  },
  buildLogged: function(build, chars) {
    var element = $('#build_' + build.id + ' .log', this.element());
    element.append(chars);
    element.deansi();
  }
});

Travis.Views.CurrentBuild = Travis.Views.Build.extend({
  initialize: function(args) {
    Travis.Views.Build.prototype.initialize.apply(this, arguments);
  },
  element: function() {
    return $('#tab_current div');
  },
  bind: function(build) {
    build.collection.bind('add', this.render);
    Travis.Views.Build.prototype.bind.apply(this, arguments);
  },
});
