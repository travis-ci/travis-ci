Travis.Views.Build.Summary = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'render', 'setStatus', 'setDuration', 'setFinishedAt');
    this.template = Travis.templates['build/summary'];

    if(this.model) {
      this.attachTo(this.model);
    }
  },
  detach: function() {
    if(this.model) {
      this.model.unbind('append:log');
      delete this.model;
    }
  },
  attachTo: function(model) {
    this.detach();
    this.model = model;
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

