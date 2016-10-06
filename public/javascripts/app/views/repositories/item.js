Travis.Views.Repositories.Item = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'render', 'setSelected', 'setLastBuild', '_setStatus', '_setDuration', '_setFinishedAt', '_setNumber');

    this.model.bind('select', this.setSelected);
    this.model.bind('deselect', this.setSelected);
    this.model.bind('change:last_build_number', this.setLastBuild);
    this.model.bind('change:last_build_status', this.setLastBuild);
    this.model.bind('change:last_build_duration', this.setLastBuild);
    this.model.bind('change:last_build_finished_at', this.setLastBuild);

    this.template = Travis.templates['repositories/item'];
  },
  render: function() {
    this.el = $(this.template(this.model.toJSON()));
    this.el.updateTimes();
    return this;
  },
  setSelected: function() {
    this.model.selected ? this.el.addClass('selected') : this.el.removeClass('selected');
  },
  setLastBuild: function() {
    this.el.parent().prepend(this.el);
    this._setStatus();
    this._setDuration();
    this._setFinishedAt();
    this._setNumber();
    this.el.updateTimes();
  },
  _setStatus: function() {
    this.el.removeClass('red green').addClass(this.model.color());
  },
  _setDuration: function() {
    this.el.find('.duration').attr('title', this.model.last_build_duration());
  },
  _setFinishedAt: function() {
    this.el.find('.finished_at').attr('title', this.model.get('last_build_finished_at'));
  },
  _setNumber: function() {
    this.el.find('.build').attr('href', '#!/' + this.model.get('slug') + '/builds/' + this.model.get('last_build_id')).text('#' + this.model.get('last_build_number'))
  },
});
