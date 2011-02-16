Travis.Views.Builds = Backbone.View.extend({
  initialize: function(args) {
    _.bindAll(this, 'bind', 'unbind', 'render', 'buildAdded', 'buildChanged');

    this.app = args.app;

    this.templates = {
      list: args.app.templates['builds/list'],
      item: args.app.templates['builds/_item']
    }
  },
  element: function() {
    return $('#tab_history div');
  },
  bind: function(repository) {
    this.repository = repository;
    repository.builds.bind('add', this.buildAdded);
    repository.builds.bind('change', this.buildChanged);
    repository.builds.bind('builds:load:start', this.startLoading);
    repository.builds.bind('builds:load:done',  this.stopLoading);
  },
  unbind: function() {
    if(this.repository) {
      this.repository.builds.unbind('add', this.buildAdded);
      this.repository.builds.unbind('change', this.buildChanged);
    }
  },
  render: function(repository) {
    this.bind(repository);
    repository.builds.load(function() {
      var element = this.element();
      element.html($(this.templates.list({ repository: repository.toJSON(), builds: repository.builds.toJSON().reverse() })));
      Travis.Helpers.Util.updateTimes(element);
    }.bind(this));
  },
  buildAdded: function(build) {
    $('tr:first-child', this.element()).after($(this.templates.item(build.toJSON())));
  },
  buildChanged: function(build) {
    $('tr#builds_' + build.id, this.element()).html($(this.templates.item(build.toJSON())));
  },
  startLoading: function() {
    $('#tab_history div').addClass('loading');
  },
  stopLoading: function() {
    $('#tab_history div').removeClass('loading');
  }
});


