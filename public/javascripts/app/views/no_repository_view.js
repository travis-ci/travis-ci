var NoRepositoryView = Backbone.View.extend({
  initialize: function(args) {
    _.bindAll(this, 'render');

    this.app = args.app;
    this.template = args.templates['repositories/missing'];
    this.element = $('#main');
  },
  render: function(name) {
    this.element.html($(this.template({ name: name })));
  }
});


