Travis.Models.Repository = Travis.Models.Base.extend({
  initialize: function() {
    _.bindAll(this, 'color', 'select', 'toJSON');
    this.builds = new Travis.Collections.Builds([], { repository: this });
  },
  color: function() {
    var status = this.get('last_build').status;
    return status == 0 ? 'green' : status == 1 ? 'red' : null;
  },
  toJSON: function(options) {
    return _.extend(Backbone.Model.prototype.toJSON.apply(this), {
      color: this.color()
    });
  },
});

Travis.Collections.Repositories = Travis.Collections.Base.extend({
  model: Travis.Models.Repository,
  url: function() {
    return '/repositories' + Util.queryString(this.options);
  },
});
