Travis.Models.Repository = Travis.Models.Base.extend({
  initialize: function() {
    Travis.Models.Base.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'color', 'toJSON');
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
  initialize: function(models) {
    Travis.Collections.Base.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'url', 'update');
  },
  url: function() {
    return '/repositories' + Util.queryString(this.options);
  },
  update: function(data) {
    var attributes = data.repository;
    attributes.last_build = _.clone(data);
    var repository = this.get(attributes.id);
    repository ? repository.set(attributes) : this.add(new Travis.Models.Repository(attributes));
  },
});
