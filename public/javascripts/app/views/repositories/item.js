Travis.Views.Repositories.Item = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'render', 'setStatus', 'setDuration', 'setFinishedAt', 'setLastBuild', 'setSelected');

    // this.model.bind('change:status', this.setStatus);
    // this.model.bind('change:duration', this.setDuration);
    // this.model.bind('change:finished_at', this.setFinishedAt);
    this.model.bind('change:last_build', this.setLastBuild);
    this.model.bind('select', this.setSelected);
    this.model.bind('deselect', this.setSelected);

    this.template = Travis.templates['repositories/item'];
  },
  render: function() {
    this.el = $(this.template(this.model.toJSON()));
    this.el.updateTimes();
    return this;
  },
  setStatus: function() {
    this.el.parent().prepend(this.el);
    this.el.removeClass('red green').addClass(this.model.color());
  },
  setLastBuild: function() {
    this.setStatus();
    this.setFinishedAt();
    this.setDuration();
    var last_build = this.model.get('last_build');
    if(last_build && last_build.number) {
      this.el.find('.build').attr('href', '#!/' + this.model.name + '/builds/' + last_build.id).text('#' + last_build.number)
    }
  },
  setDuration: function() {
    var last_build = this.model.get('last_build');
    if(last_build) {
      this.el.find('.duration').attr('title', last_build.duration);
      this.el.updateTimes();
    }
  },
  setFinishedAt: function() {
    var last_build = this.model.get('last_build');
    if(last_build) {
      this.el.find('.finished_at').attr('title', last_build.finished_at);
      this.el.updateTimes();
    }
  },
  setSelected: function() {
    this.model.selected ? this.el.addClass('selected') : this.el.removeClass('selected');
  }
});
