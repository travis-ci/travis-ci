Travis.Views.Repositories.Item = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'render', 'setStatus', 'setDuration', 'setFinishedAt', 'setLastBuild', 'setSelected');

    this.model.bind('change:status', this.setStatus);
    this.model.bind('change:duration', this.setDuration);
    this.model.bind('change:finished_at', this.setFinishedAt);
    this.model.bind('change:last_build', this.setLastBuild);
    this.model.bind('select', this.setSelected);

    this.template = Travis.templates['repositories/item'];
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
    var last_build = this.model.get('last_build');
    if(last_build && last_build.number) {
      this.$('.build').attr('href', '#!/' + this.model.name + '/builds/' + last_build.id).text('#' + last_build.number)
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
    this.model.selected ? this.el.addClass('selected') : this.el.removeClass('selected');
  }
});
