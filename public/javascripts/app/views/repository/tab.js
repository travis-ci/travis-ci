Travis.Views.Repository.Tab = Backbone.View.extend({
  contents: {
    'current': Travis.Views.Build.Current,
    'history': Travis.Views.Build.History.Table,
    'build':   Travis.Views.Build.Build,
  },
  initialize: function() {
    _.extend(this, this.options);
    _.bindAll(this, 'render', 'attachTo', 'activate', 'deactivate');

    this.template = Travis.app.templates['repository/tab_' + this.name];
  },
  render: function() {
    this.el = $(this.template({}));
    this.content = new this.contents[this.name]({ el: this.$('div'), name: this.name });
    this.el.append(this.content.render().el);
    return this;
  },
  attachTo: function(repository) {
    this.content.attachTo(repository);
  },
  activate: function() {
    this.el.addClass('active');
  },
  deactivate: function() {
    this.el.removeClass('active');
  },
});
