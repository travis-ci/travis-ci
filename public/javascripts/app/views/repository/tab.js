Travis.Views.Repository.Tab = Backbone.View.extend({
  contents: {
    'current': Travis.Views.Build.Current,
    'history': Travis.Views.Build.History.Table,
    'build':   Travis.Views.Build.Build,
  },
  initialize: function() {
    _.extend(this, this.options);
    _.bindAll(this, 'render', 'attachTo', 'activate', 'deactivate', 'updateTab');

    this.template = Travis.templates['repository/tab_' + this.name];
  },
  render: function() {
    this.el = $(this.template({}));
    this.content = new this.contents[this.name]({ name: this.name, parent: this });
    this.el.find('.tab').html(this.content.el);
    return this;
  },
  detach: function() {
    this.content.detach();
  },
  attachTo: function(repository) {
    this.detach();
    this.content.attachTo(repository);
  },
  activate: function() {
    this.el.last().addClass('active');
  },
  deactivate: function() {
    this.el.last().removeClass('active');
  },
  updateTab: function(el) {
    this.content.updateTab(this.el);
  }
});
