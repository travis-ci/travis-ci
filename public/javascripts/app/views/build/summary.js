Travis.Views.Build.Summary = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'render', 'setStatus');
    this.template = Travis.app.templates['build/summary'];

    this.model.bind('change:status', this.setStatus);
    this.model.bind('change:duration', this.setDuration);
    this.model.bind('change:finished_at', this.setFinishedAt);
  },
  render: function() {
    this.el = $(this.template(this.model.toJSON()));
    return this;
  },
  setStatus: function() {
    $(this.el).removeClass('red green').addClass(this.model.color());
  },
  setDuration: function() {
    this.$('.duration').attr('title', this.model.get('duration'));
    this.el.updateTimes();
  },
  setFinishedAt: function() {
    this.$('.finished_at').attr('title', this.model.get('finishedAt'));
    this.el.updateTimes();
  },
});

