Travis.Models.ServiceHook = Backbone.Model.extend({
  initialize: function() {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'url');
  },
  url: function() {
    return '/profile/service_hooks'
  }
});

Travis.Collections.ServiceHooks = Backbone.Collection.extend({
  model: Travis.Models.ServiceHook,
  initialize: function(models) {
    Backbone.Collection.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'url');
  },
  url: function() {
    return '/profile/service_hooks' + Utils.queryString(this.options);
  }
});
