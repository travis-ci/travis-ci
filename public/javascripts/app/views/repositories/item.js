Travis.Views.Repositories.Item = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'render', 'setStatus', 'setDuration', 'setFinishedAt', 'setLastBuild', 'setSelected');

    this.model.bind('change:status', this.setStatus);
    this.model.bind('change:duration', this.setDuration);
    this.model.bind('change:finished_at', this.setFinishedAt);
    this.model.bind('change:last_build', this.setLastBuild);
    this.model.bind('change:selected', this.setSelected);

    this.template = Travis.app.templates['repositories/item'];
  },
  render: function() {
    this.el = $(this.template(this.model.toJSON()));
    this.el.updateTimes();
    return this;
  },
  setStatus: function() {
    $(this.el).removeClass('red green').addClass(this.model.color());
  },
  setLastBuild: function() {
    this.setStatus();
    if(this.last_build && this.last_build.number) {
      this.$('.build').attr('href', Travis.app.buildUrl(this.model, this.last_build.id)).text('#' + this.last_build.number)
    }
  },
  setDuration: function() {
    this.$('.duration').attr('title', this.model.get('duration'));
    this.el.updateTimes();
  },
  setFinishedAt: function() {
    this.$('.finished_at').attr('title', this.model.get('finishedAt'));
    this.el.updateTimes();
  },
  setSelected: function() {
    this.model.get('selected') ? this.el.addClass('selected') : this.el.removeClass('selected');
  }
});
