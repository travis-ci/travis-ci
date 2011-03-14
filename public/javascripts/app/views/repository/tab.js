Travis.Views.Repository.Tab = Backbone.View.extend({
  contents: {
    'current': Travis.Views.Build.Current,
    'history': Travis.Views.Build.History.Table,
    'build':   Travis.Views.Build.Build,
  },
  initialize: function() {
    _.extend(this, this.options);
    _.bindAll(this, 'render', 'attachTo', 'activate', 'deactivate');

    this.template = Travis.templates['repository/tab_' + this.name];
  },
  detach: function() {
    this.content.detach();
  },
  attachTo: function(repository) {
    this.content.attachTo(repository);
  },
  render: function() {
    this.el = $(this.template({}));
    this.content = new this.contents[this.name]({ name: this.name, parent: this });
    this.el.find('.tab').append(this.content.render().el);
    return this;
  },
  activate: function() {
    this.el.addClass('active');
  },
  deactivate: function() {
    this.el.removeClass('active');
  },
  setTab: function() {
    var tab = this.content.tab();
    $('h5 a', this.el).attr('href', tab.url || '').html(tab.caption);
  }
});
