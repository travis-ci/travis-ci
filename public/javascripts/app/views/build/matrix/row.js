Travis.Views.Build.Matrix.Row = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'render', 'setStatus', 'setDuration', 'setFinishedAt', 'setLastBuild', 'setSelected');

    this.model.bind('change:status', this.setStatus);
    this.model.bind('change:started_at', this.setDuration);
    this.model.bind('change:finished_at', this.setDuration);
    this.model.bind('change:finished_at', this.setFinishedAt);

    this.template = Travis.templates['build/matrix/row'];
  },
  render: function() {
    this.el = $(this.template(this.model.toJSON()));
    this.el.updateTimes();
    return this;
  },
  setStatus: function() {
    this.el.removeClass('red green').addClass(this.model.color());
  },
  setDuration: function() {
    this.el.find('.duration').attr('title', this.model.get('duration'));
    this.el.updateTimes();
  },
  setFinishedAt: function() {
    this.el.find('.finished_at').attr('title', this.model.get('finished_at'));
    this.el.updateTimes();
  },
});
